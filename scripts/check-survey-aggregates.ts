/**
 * Fixture checks for T25 aggregation, the committed aggregate snapshot,
 * and T26 benchmark display derivation.
 * Run: npm run check:survey-aggregates
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  aggregateResponses,
  assertAggregatesMatchSurvey,
  parseSurveyAggregates,
  type AggregateResponseRow,
} from "../src/survey/aggregates";
import {
  buildBenchmarkQuestionViews,
  buildCompanySizeOptions,
  buildSpendMedianLookup,
  hasPublishableBenchmarkData,
} from "../src/survey/benchmark";
import { parseSurvey } from "../src/survey/schema";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const survey = parseSurvey(
  JSON.parse(readFileSync(join(root, "data", "survey-questions.json"), "utf8")),
);
const generatedAt = "2026-07-17T12:00:00.000Z";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const baseAnswers: Record<string, string | string[]> = {
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

function row(
  index: number,
  overrides: Record<string, string | string[]> = {},
): AggregateResponseRow {
  return {
    id: `response-${index}`,
    answers_json: JSON.stringify({ ...baseAnswers, ...overrides }),
  };
}

const empty = aggregateResponses(survey, [], generatedAt);
assert(empty.n === 0, "empty fixture should publish n=0");
assert(
  Object.keys(empty.questions).length === 12,
  "empty fixture should retain all aggregate question keys",
);
assert(
  !hasPublishableBenchmarkData(empty),
  "empty aggregates must not be publishable on the benchmark page",
);
assert(
  buildBenchmarkQuestionViews(survey, empty, "de").length === 0,
  "empty aggregates must yield no benchmark question views",
);

const belowThreshold = aggregateResponses(
  survey,
  Array.from({ length: 4 }, (_, index) => row(index)),
  generatedAt,
);
assert(
  Object.keys(belowThreshold.questions["company-size"].counts).length === 0,
  "n=4 option cell must be suppressed",
);
assert(
  Object.keys(belowThreshold.cross_tabs.spend_by_company_size).length === 0,
  "n=4 cross-tab row must be suppressed",
);
assert(
  !hasPublishableBenchmarkData(belowThreshold),
  "below-threshold aggregates must not be publishable",
);

const atThreshold = aggregateResponses(
  survey,
  Array.from({ length: 5 }, (_, index) => row(index)),
  generatedAt,
);
assert(
  atThreshold.questions["company-size"].counts["10-49"] === 5,
  "n=5 option cell must publish",
);
assert(
  atThreshold.questions["ai-tools"].counts.chatgpt === 5 &&
    atThreshold.questions["ai-tools"].counts.deepl === 5,
  "multi-select must count each respondent once per selected option",
);
assert(
  atThreshold.cross_tabs.spend_by_company_size["10-49"].median_band ===
    "1-500",
  "n=5 usable spend answers should publish an ordinal median",
);
assert(
  hasPublishableBenchmarkData(atThreshold),
  "n=5 aggregates must be publishable",
);

const views = buildBenchmarkQuestionViews(survey, atThreshold, "de");
assert(views.length > 0, "threshold fixture must yield question views");
const sizeView = views.find((view) => view.questionId === "company-size");
assert(!!sizeView, "company-size view must be present");
assert(
  sizeView!.rows.length === 1 && sizeView!.rows[0].optionId === "10-49",
  "only published company-size options may appear",
);
assert(
  sizeView!.rows[0].percent === 100,
  "single published option should be 100% of question n",
);
assert(
  !sizeView!.rows.some((entry) => entry.optionId === "1-9"),
  "suppressed company-size options must not appear in views",
);

const sizeOptions = buildCompanySizeOptions(survey, "en");
assert(
  sizeOptions.length === 5 && sizeOptions[0].id === "1-9",
  "comparison select must list instrument company-size options",
);

const medianLookup = buildSpendMedianLookup(survey, atThreshold, "en");
assert(
  medianLookup["10-49"]?.medianBandId === "1-500",
  "median lookup must expose published median band id",
);
assert(
  medianLookup["10-49"]?.medianBandLabel === "CHF 1–500",
  "median lookup must localize the spend band label",
);
assert(
  medianLookup["1-9"] === undefined,
  "suppressed size bands must be absent from the median lookup",
);

const preferNotRows = [
  ...Array.from({ length: 5 }, (_, index) =>
    row(index, {
      "monthly-spend-chf": index === 0 ? "0" : "1-500",
    }),
  ),
  ...Array.from({ length: 5 }, (_, index) =>
    row(index + 5, { "monthly-spend-chf": "prefer-not" }),
  ),
];
const preferNot = aggregateResponses(survey, preferNotRows, generatedAt);
assert(
  preferNot.cross_tabs.spend_by_company_size["10-49"].median_band ===
    "1-500",
  "prefer-not answers must not influence the median band",
);

let exclusiveNoneRejected = false;
try {
  aggregateResponses(
    survey,
    [row(0, { "ai-tools": ["none", "chatgpt"] })],
    generatedAt,
  );
} catch {
  exclusiveNoneRejected = true;
}
assert(
  exclusiveNoneRejected,
  "stored exclusive-none violations must fail aggregation",
);

const committed = parseSurveyAggregates(
  JSON.parse(readFileSync(join(root, "data", "survey-aggregates.json"), "utf8")),
);
assertAggregatesMatchSurvey(committed, survey);
assert(
  !hasPublishableBenchmarkData(committed) || committed.n > 0,
  "committed empty snapshot should stay non-publishable until real data ships",
);

console.log(
  `check:survey-aggregates ok (${survey.questions.length} questions, threshold 5, T26 views)`,
);
