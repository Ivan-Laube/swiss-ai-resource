/**
 * CI-ready survey Worker integration tests against wrangler dev + local D1.
 *
 * Starts `wrangler dev` with Turnstile always-pass secrets, applies migrations,
 * then asserts HTTP behavior and D1 side-effects (email gating, unlinkability,
 * keyed IP hashing, body limit, daily quota, Turnstile failure not consuming
 * quota, retention purge via the scheduled handler).
 *
 * Run: npm run test:survey-worker
 */
import {
  spawn,
  spawnSync,
  type ChildProcess,
} from "node:child_process";
import { createHash, createHmac } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerDir = join(root, "workers", "survey");
const wranglerConfig = join(workerDir, "wrangler.jsonc");
const port = Number(process.env.SURVEY_WORKER_PORT ?? "8787");
const base = `http://127.0.0.1:${port}`;
const origin = "https://aicompliant.ch";

const ALWAYS_PASS = "1x0000000000000000000000000000000AA";
const ALWAYS_FAIL = "2x0000000000000000000000000000000AA";
const IP_HASH_SECRET = "test-ip-hash-secret";

const validAnswers = {
  "company-size": "10-49",
  sector: "ict-software",
  "language-region": "german-speaking",
  "ai-maturity": "piloting-custom",
  "ai-tools": ["chatgpt", "deepl"],
  "primary-use-cases": ["translation"],
  "monthly-spend-chf": "251-1000",
  "spend-outlook-12m": "increase-up-to-50",
  "weekly-ai-users-share": "11-25",
  "hosting-requirement": "switzerland",
  "ai-governance-measures": ["none"],
  "eu-market-exposure": "no-eu",
  "deployment-blockers": ["none"],
  "vendor-decision-factors": ["swiss-entity-support"],
};

function payload(overrides: Record<string, unknown> = {}) {
  return {
    survey_id: "swiss-ai-adoption-2026",
    survey_version: 4,
    locale: "de",
    answers: validAnswers,
    email: null,
    report_opt_in: false,
    website: "",
    turnstile_token: "XXXX.DUMMY.TOKEN.XXXX",
    ...overrides,
  };
}

let failures = 0;
function check(name: string, cond: boolean, detail = ""): void {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures += 1;
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

async function post(
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<{ status: number; text: string }> {
  const res = await fetch(`${base}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...extraHeaders,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: res.status, text: await res.text() };
}

/** Retry on 429 so bursts stay within the 5/60s Workers rate limiter. */
async function postAllowingRetry(
  body: unknown,
  attempts = 6,
): Promise<{ status: number; text: string }> {
  for (let i = 0; i < attempts; i++) {
    const result = await post(body);
    if (result.status !== 429) return result;
    await delay(12_000);
  }
  return post(body);
}

function runWrangler(
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): { status: number; stdout: string; stderr: string } {
  const result = spawnSyncNode(
    [
      join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
      ...args,
    ],
    env,
  );
  return result;
}

function spawnSyncNode(
  args: string[],
  env: NodeJS.ProcessEnv,
): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env,
    encoding: "utf8",
    shell: false,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function d1Execute(sql: string): string {
  const result = runWrangler([
    "d1",
    "execute",
    "swiss-ai-survey",
    "--local",
    "-c",
    wranglerConfig,
    "--command",
    sql,
    "--json",
  ]);
  if (result.status !== 0) {
    throw new Error(
      `d1 execute failed (${result.status}): ${result.stderr}\n${result.stdout}`,
    );
  }
  return result.stdout;
}

function d1Rows<T>(sql: string): T[] {
  const raw = d1Execute(sql);
  const parsed = JSON.parse(raw) as Array<{ results?: T[] }>;
  // wrangler --json returns an array of statement results
  const first = Array.isArray(parsed) ? parsed[0] : parsed;
  if (first && typeof first === "object" && "results" in first) {
    return (first as { results: T[] }).results ?? [];
  }
  return [];
}

async function waitForWorker(timeoutMs = 60_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${base}/nope`, {
        headers: { Origin: origin },
      });
      if (res.status === 404 || res.status === 500) return;
    } catch {
      // not up yet
    }
    await delay(500);
  }
  throw new Error(`Worker did not become ready at ${base}`);
}

async function killWorker(child: ChildProcess | null): Promise<void> {
  if (!child || child.killed) return;
  child.kill("SIGTERM");
  await delay(1500);
  if (!child.killed) {
    try {
      child.kill("SIGKILL");
    } catch {
      // ignore
    }
  }
  await delay(1000);
}

function startWorker(): ChildProcess {
  return spawn(
    process.execPath,
    [
      join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
      "dev",
      "-c",
      wranglerConfig,
      "--ip",
      "127.0.0.1",
      "--port",
      String(port),
      // Exposes GET /__scheduled so the retention purge can be triggered.
      "--test-scheduled",
    ],
    {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    },
  );
}

function writeDevVars(secret: string, ipHashSecret = IP_HASH_SECRET): void {
  const path = join(workerDir, ".dev.vars");
  writeFileSync(
    path,
    `TURNSTILE_SECRET_KEY=${secret}\n` +
      (ipHashSecret ? `IP_HASH_SECRET=${ipHashSecret}\n` : "") +
      `SITE_ORIGIN=${origin}\n`,
    "utf8",
  );
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Mirrors hashClientIp in workers/survey/src/store.ts. */
function ipHash(day: string, ip: string): string {
  return createHmac("sha256", IP_HASH_SECRET).update(`${day}:${ip}`).digest("hex");
}

/** Monday of the current UTC week, YYYY-MM-DD. */
function utcWeekStart(now = new Date()): string {
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

/** IPs wrangler dev may report as CF-Connecting-IP for local requests. */
const LOCAL_IPS = ["127.0.0.1", "::1", "unknown"];

async function main(): Promise<void> {
  mkdirSync(workerDir, { recursive: true });

  // Apply local migrations
  const migrate = runWrangler([
    "d1",
    "migrations",
    "apply",
    "swiss-ai-survey",
    "--local",
    "-c",
    wranglerConfig,
  ]);
  check(
    "d1 migrations apply",
    migrate.status === 0,
    migrate.status === 0 ? "" : migrate.stderr,
  );

  writeDevVars(ALWAYS_PASS);

  let child: ChildProcess | null = null;
  try {
    child = startWorker();
    await waitForWorker();
    check("wrangler dev ready", true, base);

    // Clear tables for hermetic run
    d1Execute("DELETE FROM responses; DELETE FROM report_signups; DELETE FROM submission_quotas;");

    // --- Valid submit ---
    const ok = await postAllowingRetry(payload());
    check("valid submit -> 201", ok.status === 201, `status ${ok.status} ${ok.text}`);

    // --- Honeypot (does not consume daily quota; may still hit rate limiter) ---
    const beforeHp = d1Rows<{ c: number }>("SELECT COUNT(*) AS c FROM responses");
    const hpCountBefore = beforeHp[0]?.c ?? 0;
    const hp = await postAllowingRetry(payload({ website: "http://spam.example" }));
    check("honeypot -> 204", hp.status === 204, `status ${hp.status}`);
    const afterHp = d1Rows<{ c: number }>("SELECT COUNT(*) AS c FROM responses");
    check(
      "honeypot does not persist",
      (afterHp[0]?.c ?? 0) === hpCountBefore,
    );

    // --- Bad answer / version / exclusive none (fail before quota) ---
    const bad = await postAllowingRetry(
      payload({ answers: { ...validAnswers, "company-size": "nope" } }),
    );
    check("bad answer -> 400", bad.status === 400);

    const ver = await postAllowingRetry(payload({ survey_version: 999 }));
    check("wrong version -> 400", ver.status === 400);

    const excl = await postAllowingRetry(
      payload({ answers: { ...validAnswers, "ai-tools": ["chatgpt", "none"] } }),
    );
    check("exclusive none -> 400", excl.status === 400);

    // --- CORS / origin ---
    const opt = await fetch(`${base}/submit`, {
      method: "OPTIONS",
      headers: { Origin: origin },
    });
    check(
      "OPTIONS CORS",
      opt.status === 204 &&
        opt.headers.get("access-control-allow-origin") === origin,
    );

    const noOriginRes = await fetch(`${base}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    });
    check("POST without Origin -> 403", noOriginRes.status === 403);

    const badOrigin = await fetch(`${base}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil.example",
      },
      body: JSON.stringify(payload()),
    });
    check("POST wrong Origin -> 403", badOrigin.status === 403);

    // Cool down rate limiter before persistence checks
    await delay(12_000);

    // --- Email gating: report_opt_in false must not store email ---
    d1Execute("DELETE FROM report_signups;");
    const noOptIn = await postAllowingRetry(
      payload({
        email: "should-not-store@example.com",
        report_opt_in: false,
      }),
    );
    check("submit without opt-in -> 201", noOptIn.status === 201, `status ${noOptIn.status}`);
    const signupsNo = d1Rows<{ c: number }>(
      "SELECT COUNT(*) AS c FROM report_signups",
    );
    check("email not stored without opt-in", (signupsNo[0]?.c ?? -1) === 0);

    await delay(1_500);
    const withOptIn = await postAllowingRetry(
      payload({
        email: "bench@example.com",
        report_opt_in: true,
      }),
    );
    check("submit with opt-in -> 201", withOptIn.status === 201, `status ${withOptIn.status}`);
    const signupsYes = d1Rows<{ email: string; created_at: string }>(
      "SELECT email, created_at FROM report_signups",
    );
    check("email stored with opt-in", signupsYes.length >= 1);
    if (signupsYes[0]) {
      check(
        "signup created_at is the UTC week start (Monday)",
        signupsYes[0].created_at === utcWeekStart(),
        `${signupsYes[0].created_at}, expected ${utcWeekStart()}`,
      );
    }

    // Unlinkability: no shared id between responses and report_signups
    const responseIds = d1Rows<{ id: string }>("SELECT id FROM responses");
    const signupIds = d1Rows<{ id: string }>("SELECT id FROM report_signups");
    const overlap = responseIds.filter((r) =>
      signupIds.some((s) => s.id === r.id),
    );
    check("response and signup ids do not overlap", overlap.length === 0);

    // Unlinkability: answer rows carry no opt-in marker, and report_signups
    // keeps no insert order that could be lined up with responses.created_at.
    const responseColumns = d1Rows<{ name: string }>(
      "PRAGMA table_info(responses)",
    ).map((c) => c.name);
    check(
      "responses has no report_opt_in column",
      responseColumns.includes("answers_json") &&
        !responseColumns.includes("report_opt_in"),
      responseColumns.join(", "),
    );
    const signupsDdl = d1Rows<{ sql: string }>(
      "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'report_signups'",
    );
    check(
      "report_signups is WITHOUT ROWID",
      /WITHOUT ROWID/i.test(signupsDdl[0]?.sql ?? ""),
    );

    // --- IP hashing: quotas store only a keyed, day-scoped HMAC ---
    const day = new Date().toISOString().slice(0, 10);
    const quotas = d1Rows<{ day: string; ip_hash: string }>(
      "SELECT day, ip_hash FROM submission_quotas",
    );
    check("quota rows exist", quotas.length > 0);
    const unkeyedHashes = new Set([
      ...LOCAL_IPS.map((ip) => sha256Hex(ip)),
      sha256Hex(`unknown:${day}`),
    ]);
    for (const row of quotas) {
      check(
        "ip_hash is 64-char hex",
        /^[a-f0-9]{64}$/.test(row.ip_hash),
        row.ip_hash.slice(0, 12),
      );
      check(
        "ip_hash is not a raw IPv4",
        !/^\d{1,3}(\.\d{1,3}){3}$/.test(row.ip_hash),
      );
      check(
        "ip_hash is not an unkeyed SHA-256 of the IP",
        !unkeyedHashes.has(row.ip_hash),
      );
    }
    check(
      "ip_hash is HMAC(IP_HASH_SECRET, day:ip)",
      quotas.some((row) =>
        LOCAL_IPS.some((ip) => row.ip_hash === ipHash(row.day, ip)),
      ),
      `tried ${LOCAL_IPS.join(", ")}`,
    );

    // --- Body too large -> 413 ---
    // The Worker checks the rate limiter before the body size, so retry on
    // 429 like postAllowingRetry; otherwise this flakes when the window is spent.
    let tooBigStatus = 0;
    try {
      const oversized = JSON.stringify({
        ...payload(),
        website: "x".repeat(33 * 1024),
      });
      const probe = () => new Promise<number>((resolve, reject) => {
        const req = http.request(
          {
            hostname: "127.0.0.1",
            port,
            path: "/submit",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Origin: origin,
              "Content-Length": Buffer.byteLength(oversized),
            },
            timeout: 8_000,
          },
          (res) => {
            res.resume();
            res.on("end", () => resolve(res.statusCode ?? 0));
          },
        );
        req.on("timeout", () => {
          req.destroy();
          reject(new Error("413 probe timed out"));
        });
        req.on("error", reject);
        req.end(oversized);
      });
      for (let i = 0; i < 6; i++) {
        tooBigStatus = await probe();
        if (tooBigStatus !== 429) break;
        await delay(12_000);
      }
    } catch (err) {
      console.warn("413 probe error:", err);
      tooBigStatus = -1;
    }
    check("oversized body -> 413", tooBigStatus === 413, `status ${tooBigStatus}`);

    // --- Failed Turnstile does not consume daily quota ---
    const sumQuota = () =>
      d1Rows<{ count: number }>(
        `SELECT count FROM submission_quotas WHERE day = '${day}'`,
      ).reduce((s, r) => s + (r.count ?? 0), 0);
    const quotaSumBeforeFail = sumQuota();

    // Kill and restart with always-fail secret
    await killWorker(child);
    writeDevVars(ALWAYS_FAIL);
    child = startWorker();
    await waitForWorker();

    const failTs = await postAllowingRetry(payload());
    check(
      "always-fail Turnstile -> 403",
      failTs.status === 403,
      `status ${failTs.status}`,
    );
    const quotaSumAfterFail = sumQuota();
    check(
      "failed Turnstile does not consume daily quota",
      quotaSumAfterFail === quotaSumBeforeFail,
      `before=${quotaSumBeforeFail} after=${quotaSumAfterFail}`,
    );

    // --- Missing IP_HASH_SECRET fails closed (no unkeyed fallback) ---
    await killWorker(child);
    writeDevVars(ALWAYS_PASS, "");
    child = startWorker();
    await waitForWorker();

    const responsesBeforeNoKey = d1Rows<{ c: number }>(
      "SELECT COUNT(*) AS c FROM responses",
    )[0]?.c;
    const noKey = await postAllowingRetry(payload());
    check(
      "missing IP_HASH_SECRET -> 500",
      noKey.status === 500,
      `status ${noKey.status} ${noKey.text}`,
    );
    check(
      "missing IP_HASH_SECRET stores nothing",
      sumQuota() === quotaSumAfterFail &&
        d1Rows<{ c: number }>("SELECT COUNT(*) AS c FROM responses")[0]?.c ===
          responsesBeforeNoKey,
    );

    // Restart with always-pass for daily quota test
    await killWorker(child);
    writeDevVars(ALWAYS_PASS);
    child = startWorker();
    await waitForWorker();

    // --- Daily quota: bump every known hash to the cap, then next submit -> 429 ---
    const existingHashes = d1Rows<{ ip_hash: string }>(
      `SELECT ip_hash FROM submission_quotas WHERE day = '${day}'`,
    );
    const hashes = new Set<string>([
      ...existingHashes.map((r) => r.ip_hash),
      ...LOCAL_IPS.map((ip) => ipHash(day, ip)),
    ]);
    for (const hash of hashes) {
      d1Execute(
        `INSERT INTO submission_quotas (day, ip_hash, count) VALUES ('${day}', '${hash}', 20)
         ON CONFLICT(day, ip_hash) DO UPDATE SET count = 20`,
      );
    }
    await delay(12_000);
    const capped = await post(payload());
    check(
      "daily quota exhausted -> 429",
      capped.status === 429,
      `status ${capped.status} ${capped.text}`,
    );

    // Rate-limit burst (may already be limited)
    let got429 = capped.status === 429;
    if (!got429) {
      for (let i = 0; i < 10; i++) {
        const r = await post(payload());
        if (r.status === 429) {
          got429 = true;
          break;
        }
      }
    }
    check("429 reachable via quota or rate limit", got429);

    // --- Retention purge (scheduled handler) with week-precision signups ---
    // Rows dated 2024-01-01 are always > 24 months old; the 23-month row is
    // a week start like the Worker writes and must survive. The aggregate
    // step after the purge fails locally (no GITHUB_TOKEN); only the purge
    // is checked here.
    const nearlyExpired = new Date();
    nearlyExpired.setUTCMonth(nearlyExpired.getUTCMonth() - 23);
    const nearlyExpiredWeek = utcWeekStart(nearlyExpired);
    d1Execute(
      `INSERT INTO report_signups (id, email, locale, created_at) VALUES
         ('purge-expired', 'expired@example.com', 'de', '2024-01-01'),
         ('purge-kept', 'kept@example.com', 'de', '${nearlyExpiredWeek}');
       INSERT INTO responses (id, survey_id, survey_version, locale, answers_json, created_at)
         VALUES ('purge-expired', 'purge-test', 1, 'de', '{}', '2024-01-01 00:00:00');
       INSERT INTO submission_quotas (day, ip_hash, count)
         VALUES ('2024-01-01', '${"0".repeat(64)}', 1);`,
    );
    const scheduled = await fetch(`${base}/__scheduled?cron=0+5+*+*+1`);
    await scheduled.text();
    const purged = async (): Promise<boolean> => {
      for (let i = 0; i < 20; i++) {
        const left = d1Rows<{ c: number }>(
          "SELECT COUNT(*) AS c FROM report_signups WHERE id = 'purge-expired'",
        );
        if ((left[0]?.c ?? 1) === 0) return true;
        await delay(500);
      }
      return false;
    };
    check("purge deletes signups older than 24 months", await purged());
    const keptEmails = d1Rows<{ email: string }>(
      "SELECT email FROM report_signups",
    ).map((r) => r.email);
    check(
      "purge keeps week-start signups younger than 24 months",
      keptEmails.includes("kept@example.com") &&
        keptEmails.includes("bench@example.com"),
      `${nearlyExpiredWeek}; left: ${keptEmails.join(", ")}`,
    );
    const expiredResponses = d1Rows<{ c: number }>(
      "SELECT COUNT(*) AS c FROM responses WHERE id = 'purge-expired'",
    );
    check(
      "purge deletes responses older than 24 months",
      (expiredResponses[0]?.c ?? -1) === 0,
    );
    const oldQuotas = d1Rows<{ c: number }>(
      "SELECT COUNT(*) AS c FROM submission_quotas WHERE day = '2024-01-01'",
    );
    check("purge deletes old quota days", (oldQuotas[0]?.c ?? -1) === 0);

    console.log(
      failures === 0
        ? "\nALL SURVEY WORKER CHECKS PASSED"
        : `\n${failures} SURVEY WORKER CHECK(S) FAILED`,
    );
  } finally {
    await killWorker(child);
    const devVars = join(workerDir, ".dev.vars");
    if (existsSync(devVars)) {
      writeFileSync(
        devVars,
        `TURNSTILE_SECRET_KEY=${ALWAYS_PASS}\nIP_HASH_SECRET=${IP_HASH_SECRET}\n`,
        "utf8",
      );
    }
  }

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
