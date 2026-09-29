import surveyJson from "../../../data/survey-questions.json";
import {
  aggregateResponses,
  type AggregateResponseRow,
} from "../../../src/survey/aggregates";
import { parseSurvey } from "../../../src/survey/schema";

import type { Env } from "./env";
import { writeGitHubFile, type GitHubWriteResult } from "./github";

const survey = parseSurvey(surveyJson);

/** Page size for D1 reads — keeps cron memory bounded as n grows. */
const AGGREGATE_PAGE_SIZE = 5_000;

export interface AggregateJobResult {
  responses: number;
  write: GitHubWriteResult;
}

function targetFromEnv(env: Env) {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }
  return {
    token: env.GITHUB_TOKEN,
    repository: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH || "main",
    path: env.GITHUB_AGGREGATES_PATH || "data/survey-aggregates.json",
  };
}

async function loadAllResponseRows(
  env: Env,
): Promise<AggregateResponseRow[]> {
  const rows: AggregateResponseRow[] = [];
  let offset = 0;

  while (true) {
    const page = await env.DB.prepare(
      `SELECT id, answers_json
       FROM responses
       WHERE survey_id = ? AND survey_version = ?
       ORDER BY created_at, id
       LIMIT ? OFFSET ?`,
    )
      .bind(survey.id, survey.version, AGGREGATE_PAGE_SIZE, offset)
      .all<AggregateResponseRow>();

    const batch = page.results ?? [];
    rows.push(...batch);
    if (batch.length < AGGREGATE_PAGE_SIZE) {
      break;
    }
    offset += AGGREGATE_PAGE_SIZE;
  }

  return rows;
}

export async function runAggregateJob(
  env: Env,
  scheduledTime: number,
): Promise<AggregateJobResult> {
  const results = await loadAllResponseRows(env);

  const aggregates = aggregateResponses(
    survey,
    results,
    new Date(scheduledTime).toISOString(),
  );
  const content = `${JSON.stringify(aggregates, null, 2)}\n`;
  const write = await writeGitHubFile(targetFromEnv(env), content);

  return { responses: aggregates.n, write };
}
