import fs from "node:fs";
import path from "node:path";

import {
  assertAggregatesMatchSurvey,
  parseSurveyAggregates,
  type SurveyAggregates,
} from "./aggregates";
import { getSurvey } from "./load";

export const SURVEY_AGGREGATES_PATH = path.join(
  process.cwd(),
  "data",
  "survey-aggregates.json",
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
    return new Error(`Invalid survey aggregates (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid survey aggregates (${context}): ${error.message}`);
  }

  return new Error(`Invalid survey aggregates (${context})`);
}

/**
 * Load and validate data/survey-aggregates.json against the survey instrument.
 * Throws on missing file, invalid shape, or instrument mismatch.
 */
export function getSurveyAggregates(): SurveyAggregates {
  if (!fs.existsSync(SURVEY_AGGREGATES_PATH)) {
    throw new Error(`Survey aggregates file not found: ${SURVEY_AGGREGATES_PATH}`);
  }

  const raw = fs.readFileSync(SURVEY_AGGREGATES_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${SURVEY_AGGREGATES_PATH}: ${message}`);
  }

  let aggregates: SurveyAggregates;
  try {
    aggregates = parseSurveyAggregates(data);
  } catch (error) {
    throw formatZodError(error, SURVEY_AGGREGATES_PATH);
  }

  assertAggregatesMatchSurvey(aggregates, getSurvey());
  return aggregates;
}

/** Validate the aggregates snapshot. Returns total response count. */
export function validateSurveyAggregates(): number {
  return getSurveyAggregates().n;
}
