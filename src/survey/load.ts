import fs from "node:fs";
import path from "node:path";

import {
  parseSurvey,
  type LocalizedString,
  type Survey,
  type SurveyQuestion,
} from "./schema";

const REQUIRED_LOCALES = ["en", "fr", "it"] as const;

export const SURVEY_PATH = path.join(
  process.cwd(),
  "data",
  "survey-questions.json",
);

function formatZodError(error: unknown, context: string): Error {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    const issues = (
      error as {
        issues: Array<{ path: PropertyKey[]; message: string }>;
      }
    ).issues;
    const details = issues
      .map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  - ${field}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid survey data (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid survey data (${context}): ${error.message}`);
  }

  return new Error(`Invalid survey data (${context})`);
}

function missingLocales(value: LocalizedString): string[] {
  return REQUIRED_LOCALES.filter((locale) => {
    const text = value[locale];
    return typeof text !== "string" || text.trim().length === 0;
  });
}

function assertLocalizedComplete(
  value: LocalizedString,
  filePath: string,
  pathLabel: string,
): void {
  const missing = missingLocales(value);
  if (missing.length > 0) {
    throw new Error(
      `Invalid survey data (${filePath}): ${pathLabel} missing locale(s): ${missing.join(", ")}`,
    );
  }
}

function assertFullLocales(survey: Survey, filePath: string): void {
  assertLocalizedComplete(survey.title, filePath, "title");
  assertLocalizedComplete(survey.description, filePath, "description");

  survey.questions.forEach((question, index) => {
    const base = `questions[${index}] id=${question.id}`;
    assertLocalizedComplete(question.prompt, filePath, `${base}.prompt`);
    if (question.help) {
      assertLocalizedComplete(question.help, filePath, `${base}.help`);
    }
    if (question.input === "text") {
      return;
    }
    for (const option of question.options) {
      assertLocalizedComplete(
        option.label,
        filePath,
        `${base}.options.${option.id}.label`,
      );
    }
  });
}

function assertQuestionIdsUnique(survey: Survey, filePath: string): void {
  const seen = new Set<string>();
  for (const question of survey.questions) {
    if (seen.has(question.id)) {
      throw new Error(
        `Invalid survey data (${filePath}): duplicate question id "${question.id}"`,
      );
    }
    seen.add(question.id);
  }
}

function assertOptionIdsUnique(
  question: SurveyQuestion,
  filePath: string,
): void {
  if (question.input === "text") {
    return;
  }
  const seen = new Set<string>();
  for (const option of question.options) {
    if (seen.has(option.id)) {
      throw new Error(
        `Invalid survey data (${filePath}): question "${question.id}" has duplicate option id "${option.id}"`,
      );
    }
    seen.add(option.id);
  }
}

function assertAggregateRules(survey: Survey, filePath: string): void {
  for (const question of survey.questions) {
    if (question.input === "text" && question.aggregate) {
      throw new Error(
        `Invalid survey data (${filePath}): text question "${question.id}" must have aggregate: false`,
      );
    }
    if (
      (question.input === "single" || question.input === "multi") &&
      !question.aggregate
    ) {
      throw new Error(
        `Invalid survey data (${filePath}): choice question "${question.id}" must have aggregate: true`,
      );
    }
  }
}

/** Load and validate data/survey-questions.json. Throws on invalid shape. */
export function getSurvey(): Survey {
  if (!fs.existsSync(SURVEY_PATH)) {
    throw new Error(`Survey file not found: ${SURVEY_PATH}`);
  }

  const raw = fs.readFileSync(SURVEY_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${SURVEY_PATH}: ${message}`);
  }

  let survey: Survey;
  try {
    survey = parseSurvey(data);
  } catch (error) {
    throw formatZodError(error, SURVEY_PATH);
  }

  assertQuestionIdsUnique(survey, SURVEY_PATH);
  for (const question of survey.questions) {
    assertOptionIdsUnique(question, SURVEY_PATH);
  }
  assertAggregateRules(survey, SURVEY_PATH);
  assertFullLocales(survey, SURVEY_PATH);

  return survey;
}

/** Validate the survey file. Returns question count. */
export function validateSurvey(): number {
  return getSurvey().questions.length;
}
