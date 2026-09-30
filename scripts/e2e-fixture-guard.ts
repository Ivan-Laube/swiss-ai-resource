/**
 * Guard against the populated e2e survey-aggregates fixture leaking into
 * data/survey-aggregates.json (e.g. after an interrupted `build:e2e`).
 * A leaked fixture would publish fabricated benchmark numbers.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const AGGREGATES_PATH = path.join(ROOT, "data", "survey-aggregates.json");
export const POPULATED_FIXTURE = path.join(
  ROOT,
  "e2e",
  "fixtures",
  "survey-aggregates.populated.json",
);

/** Set by build-e2e while the fixture is installed on purpose. */
export const FIXTURE_ALLOWED_ENV = "E2E_AGGREGATES_FIXTURE";

function normalize(text: string): string | null {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return null;
  }
}

/** True when `text` is the populated e2e fixture (whitespace-insensitive). */
export function isPopulatedFixture(text: string): boolean {
  if (!existsSync(POPULATED_FIXTURE)) return false;
  const fixture = normalize(readFileSync(POPULATED_FIXTURE, "utf8"));
  return fixture !== null && normalize(text) === fixture;
}

export const LEAKED_FIXTURE_MESSAGE =
  "data/survey-aggregates.json is the e2e test fixture (fabricated responses). " +
  "Restore it with: git checkout data/survey-aggregates.json";
