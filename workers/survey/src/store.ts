import type { AnswerValue } from "../../../src/survey/answers";
import type { Env } from "./env";

/** Raw survey answers: keep at most 24 months (matches Datenschutzerklärung). */
export const RESPONSE_RETENTION_MONTHS = 24;

/**
 * Report opt-in emails: same outer bound as answers. Prefer earlier deletion
 * after the report is sent or on request (see deleteReportSignupByEmail).
 */
export const SIGNUP_RETENTION_MONTHS = 24;

export async function storeResponse(
  env: Env,
  input: {
    id: string;
    surveyId: string;
    surveyVersion: number;
    locale: string;
    answers: Record<string, AnswerValue>;
    reportOptIn: boolean;
    email: string | null;
  },
): Promise<void> {
  const answersJson = JSON.stringify(input.answers);
  const reportOptIn = input.reportOptIn ? 1 : 0;

  const statements: D1PreparedStatement[] = [
    env.DB.prepare(
      `INSERT INTO responses (id, survey_id, survey_version, locale, answers_json, report_opt_in)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(
      input.id,
      input.surveyId,
      input.surveyVersion,
      input.locale,
      answersJson,
      reportOptIn,
    ),
  ];

  // Separate id, no FK — email cannot be joined back to the response row.
  if (input.email) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO report_signups (id, email, locale) VALUES (?, ?, ?)`,
      ).bind(crypto.randomUUID(), input.email, input.locale),
    );
  }

  await env.DB.batch(statements);
}

/** Operator / deletion-request path: remove all signup rows for an email. */
export async function deleteReportSignupByEmail(
  env: Env,
  email: string,
): Promise<number> {
  const result = await env.DB
    .prepare(`DELETE FROM report_signups WHERE lower(email) = lower(?)`)
    .bind(email.trim())
    .run();
  return result.meta.changes ?? 0;
}

export interface RetentionPurgeResult {
  responsesDeleted: number;
  signupsDeleted: number;
}

/** Drop rows past the retention window (SQLite datetime modifiers). */
export async function purgeExpiredSurveyData(
  env: Env,
): Promise<RetentionPurgeResult> {
  const [responses, signups] = await env.DB.batch([
    env.DB.prepare(
      `DELETE FROM responses
       WHERE created_at < datetime('now', ?)`,
    ).bind(`-${RESPONSE_RETENTION_MONTHS} months`),
    env.DB.prepare(
      `DELETE FROM report_signups
       WHERE created_at < datetime('now', ?)`,
    ).bind(`-${SIGNUP_RETENTION_MONTHS} months`),
  ]);

  return {
    responsesDeleted: responses.meta.changes ?? 0,
    signupsDeleted: signups.meta.changes ?? 0,
  };
}
