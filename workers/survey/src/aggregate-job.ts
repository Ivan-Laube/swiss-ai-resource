import surveyJson from "../../../data/survey-questions.json";
import {
  aggregateResponses,
  type AggregateResponseRow,
} from "../../../src/survey/aggregates";
import { parseSurvey } from "../../../src/survey/schema";

import type { Env } from "./env";
import { writeGitHubFile, type GitHubWriteResult } from "./github";

const survey = parseSurvey(surveyJson);

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

export async function runAggregateJob(
  env: Env,
  scheduledTime: number,
): Promise<AggregateJobResult> {
  const query = await env.DB.prepare(
    `SELECT id, answers_json
     FROM responses
     WHERE survey_id = ? AND survey_version = ?
     ORDER BY created_at, id`,
  )
    .bind(survey.id, survey.version)
    .all<AggregateResponseRow>();

  const aggregates = aggregateResponses(
    survey,
    query.results,
    new Date(scheduledTime).toISOString(),
  );
  const content = `${JSON.stringify(aggregates, null, 2)}\n`;
  const write = await writeGitHubFile(targetFromEnv(env), content);

  return { responses: aggregates.n, write };
}
