import type { AnswerValue } from "../../../src/survey/answers";
import type { Env } from "./env";

/** Raw survey answers: keep at most 24 months (matches Datenschutzerklärung). */
export const RESPONSE_RETENTION_MONTHS = 24;

/**
 * Report opt-in emails: same outer bound as answers. Prefer earlier deletion
 * after the report is sent or on request (see deleteReportSignupByEmail).
 */
export const SIGNUP_RETENTION_MONTHS = 24;

/** Max survey POSTs per client IP (hashed) per UTC day. */
export const DAILY_SUBMIT_LIMIT = 20;

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
  // Gated on reportOptIn: the privacy policy grounds email storage in
  // consent (Datenschutzerklärung §2.2/§3), so an address without opt-in
  // must not be persisted even if the client sent one.
  if (input.email && input.reportOptIn) {
    statements.push(
      // created_at is date-only (not the shared batch's second-precision
      // datetime) so it cannot be joined back to a `responses` row by
      // matching insert timestamp — see privacy policy §2.2 unlinkability.
      env.DB.prepare(
        `INSERT INTO report_signups (id, email, locale, created_at)
         VALUES (?, ?, ?, date('now'))`,
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
  quotasDeleted: number;
}

/** Drop rows past the retention window (SQLite datetime modifiers). */
export async function purgeExpiredSurveyData(
  env: Env,
): Promise<RetentionPurgeResult> {
  const [responses, signups, quotas] = await env.DB.batch([
    env.DB.prepare(
      `DELETE FROM responses
       WHERE created_at < datetime('now', ?)`,
    ).bind(`-${RESPONSE_RETENTION_MONTHS} months`),
    env.DB.prepare(
      `DELETE FROM report_signups
       WHERE created_at < datetime('now', ?)`,
    ).bind(`-${SIGNUP_RETENTION_MONTHS} months`),
    // Quota rows only matter for the current UTC day — drop older days.
    env.DB.prepare(
      `DELETE FROM submission_quotas
       WHERE day < date('now', '-2 days')`,
    ),
  ]);

  return {
    responsesDeleted: responses.meta.changes ?? 0,
    signupsDeleted: signups.meta.changes ?? 0,
    quotasDeleted: quotas.meta.changes ?? 0,
  };
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Atomically consume one daily submission slot for a hashed client IP.
 * Returns false when the UTC-day cap is already reached (no increment).
 * Does not store the raw IP — only SHA-256 hex.
 */
export async function consumeDailySubmitQuota(
  env: Env,
  ip: string,
  limit: number = DAILY_SUBMIT_LIMIT,
): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = await sha256Hex(ip === "unknown" ? `unknown:${day}` : ip);

  const existing = await env.DB.prepare(
    `SELECT count AS count FROM submission_quotas WHERE day = ? AND ip_hash = ?`,
  )
    .bind(day, ipHash)
    .first<{ count: number }>();

  if (existing && existing.count >= limit) {
    return false;
  }

  if (!existing) {
    await env.DB.prepare(
      `INSERT INTO submission_quotas (day, ip_hash, count) VALUES (?, ?, 1)`,
    )
      .bind(day, ipHash)
      .run();
    return true;
  }

  const updated = await env.DB.prepare(
    `UPDATE submission_quotas SET count = count + 1
     WHERE day = ? AND ip_hash = ? AND count < ?`,
  )
    .bind(day, ipHash, limit)
    .run();

  return (updated.meta.changes ?? 0) > 0;
}
