import fs from "node:fs";
import path from "node:path";

import { getSourceById, getSources, type Source } from "@/sources";

import { extractText } from "./extract";
import {
  delayBetweenFetches,
  fetchSource,
  FetchError,
  type FetchAttempt,
} from "./fetch";
import { normalizeText } from "./normalize";
import {
  buildFailuresSummary,
  type RunReport,
  type SourceRunResult,
  writeFailedSnapshot,
  writeRunReport,
  writeSuccessfulSnapshot,
} from "./write";

export type SnapshotRunOptions = {
  /** When set, only this source id is processed. */
  id?: string;
  dryRun?: boolean;
  /** Local HTML/PDF file to seed (requires id; no network). */
  seedFile?: string;
};

export type SnapshotRunSummary = {
  report: RunReport;
  results: SourceRunResult[];
};

function resolveSources(id: string | undefined): Source[] {
  if (!id) {
    return getSources();
  }
  const source = getSourceById(id);
  if (!source) {
    throw new Error(`Unknown source id: ${id}`);
  }
  return [source];
}

function guessContentType(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (lower.endsWith(".html") || lower.endsWith(".htm")) {
    return "text/html";
  }
  return "application/octet-stream";
}

/**
 * Write a snapshot from a locally saved HTML/PDF file (T38 escape hatch).
 */
export async function seedSnapshotFromFile(options: {
  source: Source;
  seedFile: string;
  dryRun: boolean;
}): Promise<SourceRunResult> {
  const { source, seedFile, dryRun } = options;
  const resolved = path.resolve(seedFile);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Seed file not found: ${resolved}`);
  }

  const fetchedAt = new Date().toISOString();
  const body = fs.readFileSync(resolved);
  const contentType = guessContentType(resolved);

  try {
    const raw = await extractText({
      body,
      url: source.url,
      contentType,
      selector: source.selector,
    });
    const text = normalizeText(raw);
    const { change, meta } = writeSuccessfulSnapshot({
      id: source.id,
      url: source.url,
      fetchedUrl: `file://${resolved.split(path.sep).join("/")}`,
      fetchedAt,
      httpStatus: 200,
      contentType,
      text,
      dryRun,
      seeded: true,
    });

    return {
      id: source.id,
      ok: true,
      http_status: 200,
      change,
      consecutive_failures: 0,
      last_ok_at: meta.last_ok_at ?? fetchedAt,
      fetched_url: meta.fetched_url,
      seeded: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const { meta } = writeFailedSnapshot({
      id: source.id,
      url: source.url,
      fetchedAt,
      httpStatus: null,
      contentType,
      error: message,
      dryRun,
    });

    return {
      id: source.id,
      ok: false,
      http_status: null,
      change: "kept",
      error: message,
      consecutive_failures: meta.consecutive_failures,
      last_ok_at: meta.last_ok_at ?? null,
    };
  }
}

type UrlAttempt = {
  url: string;
  httpStatus: number | null;
  contentType: string | null;
  error: string;
};

async function tryFetchAndExtract(
  source: Source,
  url: string,
): Promise<
  | {
      ok: true;
      text: string;
      httpStatus: number;
      contentType: string | null;
      finalUrl: string;
      attempt: FetchAttempt;
    }
  | { ok: false; attempt: UrlAttempt }
> {
  let httpStatus: number | null = null;
  let contentType: string | null = null;

  try {
    const fetched = await fetchSource(url);
    httpStatus = fetched.httpStatus;
    contentType = fetched.contentType;
    const raw = await extractText({
      body: fetched.body,
      url: fetched.finalUrl,
      contentType: fetched.contentType,
      selector: source.selector,
    });
    const text = normalizeText(raw);
    return {
      ok: true,
      text,
      httpStatus: fetched.httpStatus,
      contentType: fetched.contentType,
      finalUrl: fetched.finalUrl,
      attempt: fetched.attempt,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof FetchError && httpStatus === null) {
      httpStatus = error.httpStatus;
    }
    return {
      ok: false,
      attempt: {
        url,
        httpStatus,
        contentType,
        error: message,
      },
    };
  }
}

async function processSource(
  source: Source,
  dryRun: boolean,
): Promise<SourceRunResult> {
  const fetchedAt = new Date().toISOString();
  const urls = [source.url, ...source.fallback_urls];
  const failures: UrlAttempt[] = [];

  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    const result = await tryFetchAndExtract(source, url);
    if (result.ok) {
      const { change, meta } = writeSuccessfulSnapshot({
        id: source.id,
        url: source.url,
        fetchedUrl: result.finalUrl,
        fetchedAt,
        httpStatus: result.httpStatus,
        contentType: result.contentType,
        text: result.text,
        dryRun,
        attempt: result.attempt,
      });

      return {
        id: source.id,
        ok: true,
        http_status: result.httpStatus,
        change,
        consecutive_failures: 0,
        last_ok_at: meta.last_ok_at ?? fetchedAt,
        fetched_url: meta.fetched_url,
        attempt: result.attempt,
      };
    }

    failures.push(result.attempt);
    if (index < urls.length - 1) {
      await delayBetweenFetches();
    }
  }

  const last = failures[failures.length - 1] ?? {
    url: source.url,
    httpStatus: null,
    contentType: null,
    error: "No URLs attempted",
  };
  const errorMessage =
    failures.length > 1
      ? `${last.error} (tried ${failures.length} URLs; last: ${last.url})`
      : last.error;

  const { meta } = writeFailedSnapshot({
    id: source.id,
    url: source.url,
    fetchedAt,
    httpStatus: last.httpStatus,
    contentType: last.contentType,
    error: errorMessage,
    dryRun,
  });

  return {
    id: source.id,
    ok: false,
    http_status: last.httpStatus,
    change: "kept",
    error: errorMessage,
    consecutive_failures: meta.consecutive_failures,
    last_ok_at: meta.last_ok_at ?? null,
  };
}

/**
 * Fetch, extract, normalize, and snapshot tracked sources.
 * Individual source failures are recorded; the run itself does not throw for them.
 */
export async function runSnapshots(
  options: SnapshotRunOptions = {},
): Promise<SnapshotRunSummary> {
  const dryRun = options.dryRun === true;
  const isFullRun = options.id === undefined;
  const seedFile = options.seedFile;

  if (seedFile !== undefined) {
    if (!options.id) {
      throw new Error("--seed-file requires --id=<sourceId>");
    }
    if (isFullRun) {
      throw new Error("--seed-file cannot be used for a full registry run");
    }
  }

  const sources = resolveSources(options.id);
  const results: SourceRunResult[] = [];

  if (seedFile !== undefined) {
    const result = await seedSnapshotFromFile({
      source: sources[0],
      seedFile,
      dryRun,
    });
    results.push(result);
  } else {
    for (let index = 0; index < sources.length; index += 1) {
      const source = sources[index];
      const result = await processSource(source, dryRun);
      results.push(result);

      if (index < sources.length - 1) {
        await delayBetweenFetches();
      }
    }
  }

  const changed = results
    .filter((r) => r.ok && (r.change === "new" || r.change === "changed"))
    .map((r) => r.id);

  const failures = buildFailuresSummary(results);

  const report: RunReport = {
    ran_at: new Date().toISOString(),
    dry_run: dryRun,
    total: results.length,
    ok: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    changed,
    results,
    failures,
  };

  if (isFullRun) {
    writeRunReport(report, dryRun);
  }

  return { report, results };
}

/** Format a single result for CLI logging. */
export function formatResultLine(result: SourceRunResult): string {
  const status = result.ok ? "ok" : "fail";
  const http =
    result.http_status === null ? "-" : String(result.http_status);
  const change = result.change;
  const extras: string[] = [];
  if (result.seeded) {
    extras.push("seeded");
  }
  if (result.attempt === "browser") {
    extras.push("browser-retry");
  }
  if (
    !result.ok &&
    typeof result.consecutive_failures === "number" &&
    result.consecutive_failures > 1
  ) {
    extras.push(`failures=${result.consecutive_failures}`);
  }
  const suffix = result.error ? ` ${result.error}` : "";
  const extra =
    extras.length > 0 ? ` [${extras.join(", ")}]` : "";
  return `${status} ${result.id} ${http} ${change}${extra}${suffix}`;
}
