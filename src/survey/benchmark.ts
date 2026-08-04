import type { Locale } from "@/i18n";

import {
  COMPANY_SIZE_QUESTION_ID,
  SPEND_QUESTION_ID,
  type SurveyAggregates,
} from "./aggregates";
import {
  pickLocalized,
  type Survey,
  type SurveyChoiceQuestion,
} from "./schema";

export type BenchmarkCountRow = {
  optionId: string;
  label: string;
  count: number;
  /** Share of respondents who answered this question (0–100). */
  percent: number;
};

export type BenchmarkQuestionView = {
  questionId: string;
  prompt: string;
  n: number;
  rows: BenchmarkCountRow[];
};

export type BenchmarkComparisonOption = {
  id: string;
  label: string;
};

export type BenchmarkMedianRow = {
  n: number;
  medianBandId?: string;
  medianBandLabel?: string;
};

function asChoice(
  survey: Survey,
  questionId: string,
): SurveyChoiceQuestion | undefined {
  const question = survey.questions.find((entry) => entry.id === questionId);
  if (!question || question.input === "text") return undefined;
  return question;
}

function optionLabel(
  question: SurveyChoiceQuestion,
  optionId: string,
  locale: Locale,
): string {
  const option = question.options.find((entry) => entry.id === optionId);
  if (!option) return optionId;
  return pickLocalized(option.label, locale);
}

/**
 * True when at least one published (unsuppressed) count cell exists.
 * Does not invent or reconstruct suppressed buckets.
 */
export function hasPublishableBenchmarkData(
  aggregates: SurveyAggregates,
): boolean {
  for (const question of Object.values(aggregates.questions)) {
    if (Object.keys(question.counts).length > 0) return true;
  }
  return (
    Object.keys(aggregates.cross_tabs.spend_by_company_size).length > 0
  );
}

/**
 * Build display rows for each aggregatable question that has published counts.
 * Option order follows the survey instrument; suppressed options are omitted.
 */
export function buildBenchmarkQuestionViews(
  survey: Survey,
  aggregates: SurveyAggregates,
  locale: Locale,
): BenchmarkQuestionView[] {
  const views: BenchmarkQuestionView[] = [];

  for (const question of survey.questions) {
    if (question.input === "text" || !question.aggregate) continue;

    const aggregate = aggregates.questions[question.id];
    if (!aggregate) continue;

    const publishedIds = new Set(Object.keys(aggregate.counts));
    if (publishedIds.size === 0) continue;

    const rows: BenchmarkCountRow[] = [];
    for (const option of question.options) {
      if (!publishedIds.has(option.id)) continue;
      const count = aggregate.counts[option.id];
      const percent =
        aggregate.n > 0 ? Math.round((count / aggregate.n) * 1000) / 10 : 0;
      rows.push({
        optionId: option.id,
        label: pickLocalized(option.label, locale),
        count,
        percent,
      });
    }

    if (rows.length === 0) continue;

    views.push({
      questionId: question.id,
      prompt: pickLocalized(question.prompt, locale),
      n: aggregate.n,
      rows,
    });
  }

  return views;
}

/** Company-size options from the survey instrument (for the comparison select). */
export function buildCompanySizeOptions(
  survey: Survey,
  locale: Locale,
): BenchmarkComparisonOption[] {
  const question = asChoice(survey, COMPANY_SIZE_QUESTION_ID);
  if (!question) return [];

  return question.options.map((option) => ({
    id: option.id,
    label: pickLocalized(option.label, locale),
  }));
}

/**
 * Map company-size band → published median spend band only.
 * Missing keys mean the cross-tab row was suppressed (n < threshold).
 */
export function buildSpendMedianLookup(
  survey: Survey,
  aggregates: SurveyAggregates,
  locale: Locale,
): Record<string, BenchmarkMedianRow> {
  const spendQuestion = asChoice(survey, SPEND_QUESTION_ID);
  const lookup: Record<string, BenchmarkMedianRow> = {};

  for (const [sizeId, row] of Object.entries(
    aggregates.cross_tabs.spend_by_company_size,
  )) {
    const medianBandId = row.median_band;
    lookup[sizeId] = {
      n: row.n,
      ...(medianBandId
        ? {
            medianBandId,
            medianBandLabel: spendQuestion
              ? optionLabel(spendQuestion, medianBandId, locale)
              : medianBandId,
          }
        : {}),
    };
  }

  return lookup;
}
