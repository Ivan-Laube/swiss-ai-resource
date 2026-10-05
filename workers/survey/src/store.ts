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

  const statements: D1PreparedStatement[] = [
    // No opt-in flag on the answer row: it would mark exactly the answers
    // that have an email in report_signups (migration 0003 dropped it).
    env.DB.prepare(
      `INSERT INTO responses (id, survey_id, survey_version, locale, answers_json)
       VALUES (?, ?, ?, ?, ?)`,
    ).bind(
      input.id,
      input.surveyId,
      input.surveyVersion,
      input.locale,
      answersJson,
    ),
  ];

  // Separate id, no FK — email cannot be joined back to the response row.
  // Gated on reportOptIn: the privacy policy grounds email storage in
  // consent (Datenschutzerklärung §2.2/§3), so an address without opt-in
  // must not be persisted even if the client sent one.
  if (input.email && input.reportOptIn) {
    statements.push(
      // created_at is the Monday of the current UTC week (not the shared
      // batch's second-precision datetime, nor the day) so it cannot be
      // matched to a `responses` row by insert time — see privacy policy
      // §2.2 unlinkability. The table has no rowid (migration 0003), so
      // insert order is not kept either.
      env.DB.prepare(
        `INSERT INTO report_signups (id, email, locale, created_at)
         VALUES (?, ?, ?, date('now', '-6 days', 'weekday 1'))`,
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
    // created_at is a week-start date, so compare date to date. The coarser
    // date only moves deletion earlier (by up to six days), never later.
    env.DB.prepare(
      `DELETE FROM report_signups
       WHERE created_at < date('now', ?)`,
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

/**
 * HMAC-SHA256(secret, "<UTC day>:<ip>") as hex. A plain SHA-256 of an IPv4
 * address can be reversed by hashing all 2^32 addresses; without the Worker
 * secret this cannot. The day in the message rotates the hash daily, so the
 * same IP gets unrelated values on different days.
 */
async function hashClientIp(
  secret: string,
  day: string,
  ip: string,
): Promise<string> {
  if (!secret) {
    throw new Error("IP_HASH_SECRET is not configured");
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${day}:${ip}`),
  );
  return [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Atomically consume one daily submission slot for a hashed client IP.
 * Returns false when the UTC-day cap is already reached (no increment).
 * Does not store the raw IP — only a keyed, day-scoped hash (hashClientIp).
 */
export async function consumeDailySubmitQuota(
  env: Env,
  ip: string,
  limit: number = DAILY_SUBMIT_LIMIT,
): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = await hashClientIp(env.IP_HASH_SECRET, day, ip);

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
