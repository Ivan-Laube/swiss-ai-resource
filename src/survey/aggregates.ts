import { z } from "zod";

import { validateAnswers, type AnswerValue } from "./answers";
import type { Survey, SurveyChoiceQuestion } from "./schema";

export const SURVEY_SUPPRESSION_THRESHOLD = 5;
export const SPEND_QUESTION_ID = "monthly-spend-chf";
export const COMPANY_SIZE_QUESTION_ID = "company-size";

const countMapSchema = z.record(
  z.string().min(1),
  z.number().int().min(SURVEY_SUPPRESSION_THRESHOLD),
);

export const surveyQuestionAggregateSchema = z
  .object({
    n: z.number().int().nonnegative(),
    counts: countMapSchema,
  })
  .strict();

export const surveyCrossTabRowSchema = surveyQuestionAggregateSchema
  .extend({
    median_band: z.string().min(1).optional(),
  })
  .strict();

export const surveyAggregatesSchema = z
  .object({
    survey_id: z.string().min(1),
    survey_version: z.number().int().positive(),
    generated_at: z.iso.datetime().nullable(),
    n: z.number().int().nonnegative(),
    questions: z.record(z.string().min(1), surveyQuestionAggregateSchema),
    cross_tabs: z
      .object({
        spend_by_company_size: z.record(
          z.string().min(1),
          surveyCrossTabRowSchema,
        ),
      })
      .strict(),
  })
  .strict();

export type SurveyQuestionAggregate = z.infer<
  typeof surveyQuestionAggregateSchema
>;
export type SurveyCrossTabRow = z.infer<typeof surveyCrossTabRowSchema>;
export type SurveyAggregates = z.infer<typeof surveyAggregatesSchema>;

export interface AggregateResponseRow {
  id?: string;
  answers_json: string;
}

export function parseSurveyAggregates(data: unknown): SurveyAggregates {
  return surveyAggregatesSchema.parse(data);
}

export function assertAggregatesMatchSurvey(
  aggregates: SurveyAggregates,
  survey: Survey,
): void {
  if (
    aggregates.survey_id !== survey.id ||
    aggregates.survey_version !== survey.version
  ) {
    throw new Error(
      `Aggregate instrument ${aggregates.survey_id}@${aggregates.survey_version} does not match ${survey.id}@${survey.version}`,
    );
  }
}

function increment(counts: Map<string, number>, optionId: string): void {
  counts.set(optionId, (counts.get(optionId) ?? 0) + 1);
}

function publishCounts(counts: Map<string, number>): Record<string, number> {
  return Object.fromEntries(
    [...counts.entries()].filter(
      ([, count]) => count >= SURVEY_SUPPRESSION_THRESHOLD,
    ),
  );
}

function parseAnswersRow(
  survey: Survey,
  row: AggregateResponseRow,
  index: number,
): Record<string, AnswerValue> {
  let raw: unknown;
  try {
    raw = JSON.parse(row.answers_json) as unknown;
  } catch {
    throw new Error(
      `Response ${row.id ?? `at index ${index}`} has invalid answers_json`,
    );
  }

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(
      `Response ${row.id ?? `at index ${index}`} answers_json must be an object`,
    );
  }

  const validated = validateAnswers(
    survey,
    raw as Record<string, unknown>,
  );
  if (!validated.ok) {
    throw new Error(
      `Response ${row.id ?? `at index ${index}`} is invalid: ${validated.error}`,
    );
  }
  return validated.answers;
}

function aggregatableQuestions(survey: Survey): SurveyChoiceQuestion[] {
  return survey.questions.filter(
    (question): question is SurveyChoiceQuestion =>
      question.aggregate && question.input !== "text",
  );
}

function orderedMedianBand(
  spendQuestion: SurveyChoiceQuestion,
  counts: Map<string, number>,
): string | undefined {
  const ordered = spendQuestion.options
    .map((option) => option.id)
    .filter((optionId) => optionId !== "prefer-not");
  const usableN = ordered.reduce(
    (total, optionId) => total + (counts.get(optionId) ?? 0),
    0,
  );
  if (usableN < SURVEY_SUPPRESSION_THRESHOLD) return undefined;

  const target = Math.ceil(usableN / 2);
  let cumulative = 0;
  for (const optionId of ordered) {
    cumulative += counts.get(optionId) ?? 0;
    if (cumulative >= target) return optionId;
  }
  return undefined;
}

/**
 * Build the public T25 snapshot from already version-filtered D1 rows.
 * Throws on corrupt stored answers rather than silently publishing partial data.
 */
export function aggregateResponses(
  survey: Survey,
  rows: AggregateResponseRow[],
  generatedAt = new Date().toISOString(),
): SurveyAggregates {
  const questions = aggregatableQuestions(survey);
  const questionTallies = new Map<
    string,
    { n: number; counts: Map<string, number> }
  >(
    questions.map((question) => [
      question.id,
      { n: 0, counts: new Map<string, number>() },
    ]),
  );
  const sizeTallies = new Map<
    string,
    { n: number; spendCounts: Map<string, number> }
  >();

  rows.forEach((row, index) => {
    const answers = parseAnswersRow(survey, row, index);

    for (const question of questions) {
      const answer = answers[question.id];
      if (answer === undefined) continue;

      const tally = questionTallies.get(question.id);
      if (!tally) throw new Error(`Missing tally for "${question.id}"`);
      tally.n += 1;

      const selected = Array.isArray(answer) ? answer : [answer];
      for (const optionId of selected) increment(tally.counts, optionId);
    }

    const companySize = answers[COMPANY_SIZE_QUESTION_ID];
    const spend = answers[SPEND_QUESTION_ID];
    if (typeof companySize !== "string" || typeof spend !== "string") return;

    const sizeTally = sizeTallies.get(companySize) ?? {
      n: 0,
      spendCounts: new Map<string, number>(),
    };
    sizeTally.n += 1;
    increment(sizeTally.spendCounts, spend);
    sizeTallies.set(companySize, sizeTally);
  });

  const publishedQuestions = Object.fromEntries(
    questions.map((question) => {
      const tally = questionTallies.get(question.id);
      if (!tally) throw new Error(`Missing tally for "${question.id}"`);
      return [
        question.id,
        { n: tally.n, counts: publishCounts(tally.counts) },
      ];
    }),
  );

  const spendQuestion = questions.find(
    (question) => question.id === SPEND_QUESTION_ID,
  );
  if (!spendQuestion) {
    throw new Error(
      `Survey has no aggregatable "${SPEND_QUESTION_ID}" question`,
    );
  }

  const sizeQuestion = questions.find(
    (question) => question.id === COMPANY_SIZE_QUESTION_ID,
  );
  if (!sizeQuestion) {
    throw new Error(
      `Survey has no aggregatable "${COMPANY_SIZE_QUESTION_ID}" question`,
    );
  }

  const spendByCompanySize = Object.fromEntries(
    sizeQuestion.options.flatMap((option) => {
      const tally = sizeTallies.get(option.id);
      if (!tally || tally.n < SURVEY_SUPPRESSION_THRESHOLD) return [];

      const medianBand = orderedMedianBand(spendQuestion, tally.spendCounts);
      const row: SurveyCrossTabRow = {
        n: tally.n,
        counts: publishCounts(tally.spendCounts),
        ...(medianBand ? { median_band: medianBand } : {}),
      };
      return [[option.id, row] as const];
    }),
  );

  return parseSurveyAggregates({
    survey_id: survey.id,
    survey_version: survey.version,
    generated_at: generatedAt,
    n: rows.length,
    questions: publishedQuestions,
    cross_tabs: { spend_by_company_size: spendByCompanySize },
  });
}
