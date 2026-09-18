/**
 * Fetch the latest published survey aggregates from the dedicated
 * swiss-ai-survey-data repo and overwrite data/survey-aggregates.json
 * with them before the build runs.
 *
 * The weekly survey Worker cron (workers/survey) now writes aggregates
 * to that separate repo instead of this one, so its GitHub PAT can be
 * scoped to just that data file instead of the whole site (see the
 * "Accepted risk — PAT blast radius" note in DEPLOY.md). This script is
 * how the aggregated data gets back into the Next.js static export.
 *
 * Best-effort: on any fetch/parse/validation failure this logs a warning
 * and leaves the existing committed data/survey-aggregates.json in place
 * (a stale-but-valid fallback) rather than failing the build. The data
 * repo is public, so no auth is needed to read it.
 *
 * Run: npm run sync:survey-aggregates
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  assertAggregatesMatchSurvey,
  parseSurveyAggregates,
} from "../src/survey/aggregates";
import { parseSurvey } from "../src/survey/schema";
import surveyJson from "../data/survey-questions.json";

const SOURCE_URL =
  "https://raw.githubusercontent.com/Ivan-Laube/swiss-ai-survey-data/main/survey-aggregates.json";
const FETCH_TIMEOUT_MS = 10_000;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(root, "data", "survey-aggregates.json");

function warn(message: string): void {
  console.warn(`sync:survey-aggregates: ${message} — keeping committed copy.`);
}

async function main(): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(SOURCE_URL, { signal: controller.signal });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warn(`fetch failed (${message})`);
    return;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    warn(`fetch returned HTTP ${response.status}`);
    return;
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    warn("fetched body is not valid JSON");
    return;
  }

  let aggregates;
  try {
    aggregates = parseSurveyAggregates(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warn(`fetched aggregates failed schema validation (${message})`);
    return;
  }

  try {
    assertAggregatesMatchSurvey(aggregates, parseSurvey(surveyJson));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warn(`fetched aggregates do not match this survey instrument (${message})`);
    return;
  }

  const json = `${JSON.stringify(aggregates, null, 2)}\n`;
  writeFileSync(outputPath, json, "utf8");
  console.log(
    `sync:survey-aggregates: synced ${outputPath} from ${SOURCE_URL} (n=${aggregates.n}).`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  warn(`unexpected error (${message})`);
});
