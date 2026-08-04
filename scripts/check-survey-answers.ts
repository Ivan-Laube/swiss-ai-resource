/**
 * Lightweight checks for survey intake answer validation (T23).
 * Run: npm run check:survey-answers
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  isHoneypotTriggered,
  validateAnswers,
  validateIntake,
} from "../src/survey/answers";
import { parseSurvey } from "../src/survey/schema";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const survey = parseSurvey(
  JSON.parse(readFileSync(join(root, "data", "survey-questions.json"), "utf8")),
);

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const validAnswers: Record<string, unknown> = {
  "company-size": "10-49",
  sector: "ict-software",
  "language-region": "german-speaking",
  "ai-maturity": "piloting",
  "ai-tools": ["chatgpt", "deepl"],
  "primary-use-cases": ["translation"],
  "monthly-spend-chf": "1-500",
  "hosting-requirement": "switzerland",
  "personal-data-in-ai": "no",
  "eu-market-exposure": "no",
  "deployment-blockers": ["none"],
  "vendor-decision-factors": ["swiss-entity-support"],
};

const ok = validateAnswers(survey, validAnswers);
assert(ok.ok, `expected valid answers: ${!ok.ok ? ok.error : ""}`);

const exclusiveBad = validateAnswers(survey, {
  ...validAnswers,
  "ai-tools": ["chatgpt", "none"],
});
assert(!exclusiveBad.ok, "expected exclusive none rejection for ai-tools");

const unknownOpt = validateAnswers(survey, {
  ...validAnswers,
  "company-size": "not-a-band",
});
assert(!unknownOpt.ok, "expected unknown option rejection");

const intakeOk = validateIntake(survey, {
  survey_id: survey.id,
  survey_version: survey.version,
  locale: "de",
  answers: validAnswers,
  email: "test@example.com",
  report_opt_in: true,
  website: "",
  turnstile_token: "test-token",
});
assert(intakeOk.ok, `expected valid intake: ${!intakeOk.ok ? intakeOk.error : ""}`);
if (intakeOk.ok) {
  assert(intakeOk.email === "test@example.com", "email should be preserved");
}

const wrongVersion = validateIntake(survey, {
  survey_id: survey.id,
  survey_version: 999,
  locale: "de",
  answers: validAnswers,
  turnstile_token: "test-token",
});
assert(!wrongVersion.ok, "expected wrong survey_version rejection");

assert(isHoneypotTriggered("https://spam.example"), "honeypot should trigger");
assert(!isHoneypotTriggered(""), "empty honeypot should not trigger");
assert(!isHoneypotTriggered(undefined), "undefined honeypot should not trigger");

console.log(
  `check:survey-answers ok (${survey.questions.length} questions, version ${survey.version})`,
);
