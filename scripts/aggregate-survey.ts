/**
 * Generate the T25 snapshot from Wrangler's local D1 database.
 * Run: npm run aggregate:survey -- --local [--write]
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  aggregateResponses,
  parseSurveyAggregates,
  type AggregateResponseRow,
} from "../src/survey/aggregates";
import { parseSurvey } from "../src/survey/schema";
import surveyJson from "../data/survey-questions.json";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(root, "data", "survey-aggregates.json");
const args = new Set(process.argv.slice(2));

for (const arg of args) {
  if (arg !== "--local" && arg !== "--write") {
    throw new Error(`Unknown argument "${arg}"`);
  }
}
if (!args.has("--local")) {
  throw new Error(
    "Refusing to query D1 without --local; production aggregation runs inside the scheduled Worker",
  );
}

const survey = parseSurvey(surveyJson);
const sql = [
  "SELECT id, answers_json",
  "FROM responses",
  `WHERE survey_id = '${survey.id.replaceAll("'", "''")}'`,
  `AND survey_version = ${survey.version}`,
  "ORDER BY created_at, id",
].join(" ");

const wranglerArgs = [
  join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
  "d1",
  "execute",
  "swiss-ai-survey",
  "--local",
  "-c",
  "workers/survey/wrangler.jsonc",
  "--command",
  sql,
  "--json",
];
const result = spawnSync(process.execPath, wranglerArgs, {
  cwd: root,
  encoding: "utf8",
  shell: false,
});

if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(
    `Wrangler D1 query failed (${result.status ?? "unknown"}): ${result.stderr.trim()}`,
  );
}

const payload = JSON.parse(result.stdout) as unknown;
if (!Array.isArray(payload) || payload.length !== 1) {
  throw new Error("Unexpected Wrangler D1 JSON response");
}
const query = payload[0] as {
  success?: unknown;
  results?: unknown;
};
if (query.success !== true || !Array.isArray(query.results)) {
  throw new Error("Wrangler D1 query did not return a successful result set");
}

const rows: AggregateResponseRow[] = query.results.map((value, index) => {
  if (
    value === null ||
    typeof value !== "object" ||
    typeof (value as { id?: unknown }).id !== "string" ||
    typeof (value as { answers_json?: unknown }).answers_json !== "string"
  ) {
    throw new Error(`Invalid D1 response row at index ${index}`);
  }
  return value as AggregateResponseRow;
});

const aggregates = parseSurveyAggregates(aggregateResponses(survey, rows));
const json = `${JSON.stringify(aggregates, null, 2)}\n`;

if (args.has("--write")) {
  writeFileSync(outputPath, json, "utf8");
  console.log(`Wrote ${outputPath} (${aggregates.n} responses)`);
} else {
  process.stdout.write(json);
}
