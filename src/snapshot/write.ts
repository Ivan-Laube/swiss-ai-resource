import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { FetchAttempt } from "./fetch";
import { createUnifiedDiff } from "./diff";

export const SNAPSHOTS_DIR = path.join(process.cwd(), "snapshots");
export const SNAPSHOTS_META_DIR = path.join(SNAPSHOTS_DIR, "_meta");
export const SNAPSHOTS_DIFFS_DIR = path.join(SNAPSHOTS_DIR, "_diffs");
export const RUN_REPORT_PATH = path.join(SNAPSHOTS_DIR, "_run.json");
export const CLASSIFY_REPORT_PATH = path.join(SNAPSHOTS_DIR, "_classify.json");
export const ACT_DIR = path.join(SNAPSHOTS_DIR, "_act");
export const ACT_REPORT_PATH = path.join(SNAPSHOTS_DIR, "_act.json");
export const ACT_BRIEF_PATH = path.join(ACT_DIR, "material-brief.md");
export const ACT_FAILURES_BRIEF_PATH = path.join(ACT_DIR, "fetch-failures.md");

export type SnapshotChange = "new" | "changed" | "unchanged" | "kept";

export type SnapshotMeta = {
  id: string;
  url: string;
  /** URL that actually returned the body (primary or fallback). */
  fetched_url: string | null;
  fetched_at: string;
  http_status: number | null;
  content_type: string | null;
  sha256: string | null;
  byte_length: number | null;
  ok: boolean;
  error?: string;
  /** Which header profile succeeded (omit when seeded or failed). */
  attempt?: FetchAttempt;
  /** True when the snapshot was written from a local --seed-file. */
  seeded?: boolean;
  /** Consecutive failed runs (reset to 0 on success). */
  consecutive_failures?: number;
  /** Last successful fetch/seed timestamp, carried across failures. */
  last_ok_at?: string | null;
};

export type SourceRunFailure = {
  id: string;
  http_status: number | null;
  error: string;
  consecutive_failures: number;
  last_ok_at: string | null;
};

export type SourceRunResult = {
  id: string;
  ok: boolean;
  http_status: number | null;
  change: SnapshotChange;
  error?: string;
  consecutive_failures?: number;
  last_ok_at?: string | null;
  fetched_url?: string | null;
  attempt?: FetchAttempt;
  seeded?: boolean;
};

export type RunReport = {
  ran_at: string;
  dry_run: boolean;
  total: number;
  ok: number;
  failed: number;
  changed: string[];
  results: SourceRunResult[];
  failures: SourceRunFailure[];
};

export function snapshotTextPath(id: string): string {
  return path.join(SNAPSHOTS_DIR, `${id}.txt`);
}

export function snapshotMetaPath(id: string): string {
  return path.join(SNAPSHOTS_META_DIR, `${id}.json`);
}

export function snapshotDiffPath(id: string): string {
  return path.join(SNAPSHOTS_DIFFS_DIR, `${id}.patch`);
}

/** Read the current normalized snapshot text, if it exists. */
export function readSnapshotText(id: string): string | null {
  const filePath = snapshotTextPath(id);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

/** Read previous meta leniently (fields optional for pre-T38 files). */
export function readSnapshotMeta(id: string): SnapshotMeta | null {
  const filePath = snapshotMetaPath(id);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (!raw || typeof raw !== "object") {
      return null;
    }
    const obj = raw as Record<string, unknown>;
    return {
      id: typeof obj.id === "string" ? obj.id : id,
      url: typeof obj.url === "string" ? obj.url : "",
      fetched_url:
        typeof obj.fetched_url === "string"
          ? obj.fetched_url
          : typeof obj.url === "string"
            ? obj.url
            : null,
      fetched_at:
        typeof obj.fetched_at === "string" ? obj.fetched_at : "",
      http_status:
        typeof obj.http_status === "number" ? obj.http_status : null,
      content_type:
        typeof obj.content_type === "string" ? obj.content_type : null,
      sha256: typeof obj.sha256 === "string" ? obj.sha256 : null,
      byte_length:
        typeof obj.byte_length === "number" ? obj.byte_length : null,
      ok: obj.ok === true,
      error: typeof obj.error === "string" ? obj.error : undefined,
      attempt:
        obj.attempt === "bot" || obj.attempt === "browser"
          ? obj.attempt
          : undefined,
      seeded: obj.seeded === true ? true : undefined,
      consecutive_failures:
        typeof obj.consecutive_failures === "number"
          ? obj.consecutive_failures
          : undefined,
      last_ok_at:
        typeof obj.last_ok_at === "string"
          ? obj.last_ok_at
          : obj.last_ok_at === null
            ? null
            : undefined,
    };
  } catch {
    return null;
  }
}

export function sha256Text(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

export function ensureSnapshotDirs(): void {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  fs.mkdirSync(SNAPSHOTS_META_DIR, { recursive: true });
  fs.mkdirSync(SNAPSHOTS_DIFFS_DIR, { recursive: true });
}

/**
 * Write normalized text + meta for a successful fetch or seed.
 * Returns change status relative to any previous snapshot file.
 */
export function writeSuccessfulSnapshot(options: {
  id: string;
  url: string;
  fetchedUrl: string;
  fetchedAt: string;
  httpStatus: number;
  contentType: string | null;
  text: string;
  dryRun: boolean;
  attempt?: FetchAttempt;
  seeded?: boolean;
}): { change: SnapshotChange; meta: SnapshotMeta } {
  const {
    id,
    url,
    fetchedUrl,
    fetchedAt,
    httpStatus,
    contentType,
    text,
    dryRun,
    attempt,
    seeded,
  } = options;
  const hash = sha256Text(text);
  const previous = readSnapshotText(id);
  let change: SnapshotChange;
  if (previous === null) {
    change = "new";
  } else if (previous === text) {
    change = "unchanged";
  } else {
    change = "changed";
  }

  const meta: SnapshotMeta = {
    id,
    url,
    fetched_url: fetchedUrl,
    fetched_at: fetchedAt,
    http_status: httpStatus,
    content_type: contentType,
    sha256: hash,
    byte_length: Buffer.byteLength(text, "utf8"),
    ok: true,
    consecutive_failures: 0,
    last_ok_at: fetchedAt,
  };
  if (attempt) {
    meta.attempt = attempt;
  }
  if (seeded) {
    meta.seeded = true;
  }

  if (!dryRun) {
    ensureSnapshotDirs();
    if (change === "changed" && previous !== null) {
      const patch = createUnifiedDiff(id, previous, text);
      fs.writeFileSync(snapshotDiffPath(id), patch, "utf8");
    }
    if (change !== "unchanged") {
      fs.writeFileSync(snapshotTextPath(id), text, "utf8");
    }
    fs.writeFileSync(
      snapshotMetaPath(id),
      `${JSON.stringify(meta, null, 2)}\n`,
      "utf8",
    );
  }

  return { change, meta };
}

/**
 * Record a failed fetch. Keeps any previous .txt; writes meta with ok: false.
 * Increments consecutive_failures and preserves last_ok_at from prior meta.
 */
export function writeFailedSnapshot(options: {
  id: string;
  url: string;
  fetchedAt: string;
  httpStatus: number | null;
  contentType: string | null;
  error: string;
  dryRun: boolean;
}): { change: SnapshotChange; meta: SnapshotMeta } {
  const { id, url, fetchedAt, httpStatus, contentType, error, dryRun } =
    options;

  const previous = readSnapshotMeta(id);
  const previousFailures =
    previous && typeof previous.consecutive_failures === "number"
      ? previous.consecutive_failures
      : previous && previous.ok === false
        ? 1
        : 0;
  const consecutiveFailures = previousFailures + 1;

  let lastOkAt: string | null = null;
  if (previous) {
    if (previous.ok && previous.fetched_at) {
      lastOkAt = previous.fetched_at;
    } else if (typeof previous.last_ok_at === "string") {
      lastOkAt = previous.last_ok_at;
    } else if (previous.last_ok_at === null) {
      lastOkAt = null;
    }
  }

  const meta: SnapshotMeta = {
    id,
    url,
    fetched_url: null,
    fetched_at: fetchedAt,
    http_status: httpStatus,
    content_type: contentType,
    sha256: null,
    byte_length: null,
    ok: false,
    error,
    consecutive_failures: consecutiveFailures,
    last_ok_at: lastOkAt,
  };

  if (!dryRun) {
    ensureSnapshotDirs();
    fs.writeFileSync(
      snapshotMetaPath(id),
      `${JSON.stringify(meta, null, 2)}\n`,
      "utf8",
    );
  }

  return { change: "kept", meta };
}

export function writeRunReport(report: RunReport, dryRun: boolean): void {
  if (dryRun) {
    return;
  }
  ensureSnapshotDirs();
  fs.writeFileSync(
    RUN_REPORT_PATH,
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
}

/** Build the failures summary array from per-source results. */
export function buildFailuresSummary(
  results: SourceRunResult[],
): SourceRunFailure[] {
  return results
    .filter((r) => !r.ok)
    .map((r) => ({
      id: r.id,
      http_status: r.http_status,
      error: r.error ?? "unknown error",
      consecutive_failures: r.consecutive_failures ?? 1,
      last_ok_at: r.last_ok_at ?? null,
    }));
}
