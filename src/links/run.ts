import fs from "node:fs";

import {
  delayBetweenFetches,
  RUN_REPORT_PATH,
  type RunReport,
} from "@/snapshot";
import { getSources } from "@/sources";

import { collectPublishedUrls } from "./collect";
import { buildLinksIssueTitle } from "./brief";
import { probeUrl } from "./probe";
import {
  linksReportSchema,
  type LinkResult,
  type LinksReport,
} from "./schema";
import { writeLinksReport } from "./write";

export type CheckLinksOptions = {
  dryRun?: boolean;
  write?: boolean;
};

export type CheckLinksSummary = {
  report: LinksReport;
  issueTitle: string | null;
  briefPath: string | null;
};

type RunUrlStatus = {
  ok: boolean;
  httpStatus: number | null;
  error?: string;
};

function isSuccessStatus(status: number | null): boolean {
  return status !== null && status >= 200 && status < 300;
}

/** Map published URL → T15 run reachability (by joining source id → url). */
function loadRunUrlStatuses(): Map<string, RunUrlStatus> {
  const map = new Map<string, RunUrlStatus>();
  if (!fs.existsSync(RUN_REPORT_PATH)) {
    return map;
  }

  const raw = fs.readFileSync(RUN_REPORT_PATH, "utf8");
  const runReport = JSON.parse(raw) as RunReport;
  const sourcesById = new Map(getSources().map((s) => [s.id, s]));

  for (const result of runReport.results) {
    const source = sourcesById.get(result.id);
    if (!source) {
      continue;
    }
    map.set(source.url, {
      ok: isSuccessStatus(result.http_status),
      httpStatus: result.http_status,
      error: result.error,
    });
  }

  return map;
}

export function formatLinksSummary(report: LinksReport): string {
  return [
    `links: total=${report.summary.total}`,
    `ok=${report.summary.ok}`,
    `broken=${report.summary.broken}`,
    `reused=${report.summary.reused}`,
    `probed=${report.summary.probed}`,
  ].join(" ");
}

export async function checkLinks(
  options: CheckLinksOptions = {},
): Promise<CheckLinksSummary> {
  const dryRun = Boolean(options.dryRun);
  const write = Boolean(options.write) && !dryRun;

  const citations = collectPublishedUrls();
  const runStatuses = loadRunUrlStatuses();
  const urls = [...citations.keys()].sort();

  const results: LinkResult[] = [];
  let reused = 0;
  let probed = 0;
  let firstProbe = true;

  for (const url of urls) {
    const sources = citations.get(url) ?? [];
    const fromRun = runStatuses.get(url);

    if (fromRun) {
      reused += 1;
      results.push({
        url,
        ok: fromRun.ok,
        http_status: fromRun.httpStatus,
        error: fromRun.ok
          ? undefined
          : (fromRun.error ??
            (fromRun.httpStatus !== null
              ? `HTTP ${fromRun.httpStatus}`
              : "Failed in T15 run")),
        reused_from_run: true,
        sources,
      });
      continue;
    }

    if (!firstProbe) {
      await delayBetweenFetches();
    }
    firstProbe = false;
    probed += 1;

    const probe = await probeUrl(url);
    results.push({
      url,
      ok: probe.ok,
      http_status: probe.httpStatus,
      error: probe.error,
      reused_from_run: false,
      sources,
    });
  }

  const okCount = results.filter((r) => r.ok).length;
  const brokenCount = results.length - okCount;

  const report = linksReportSchema.parse({
    checked_at: new Date().toISOString(),
    dry_run: dryRun || !write,
    results,
    summary: {
      total: results.length,
      ok: okCount,
      broken: brokenCount,
      reused,
      probed,
    },
  } satisfies LinksReport);

  let briefPath: string | null = null;
  if (write) {
    const written = writeLinksReport(report);
    briefPath = written.briefPath;
  }

  const issueTitle =
    brokenCount > 0 ? buildLinksIssueTitle(report.checked_at) : null;

  return { report, issueTitle, briefPath };
}
