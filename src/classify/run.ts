import fs from "node:fs";

import { callAnthropic, getModel } from "@/lib/anthropic";
import { getSourceById } from "@/sources";
import {
  CLASSIFY_REPORT_PATH,
  diffStats,
  RUN_REPORT_PATH,
  snapshotDiffPath,
  truncateDiff,
  type RunReport,
  type SnapshotChange,
} from "@/snapshot";
import { FETCH_DELAY_MS } from "@/snapshot/fetch";

import {
  buildClassificationPrompt,
  buildFixJsonPrompt,
  type ClassificationPrompt,
} from "./prompt";
import { parseLlmClassification } from "./parse";
import {
  classifyReportSchema,
  type ClassifyReport,
  type SourceClassification,
} from "./schema";

const DEFAULT_CLASSIFY_MODEL = "claude-sonnet-4-20250514";

export function getClassifyModel(): string {
  return getModel("CLASSIFY_MODEL", DEFAULT_CLASSIFY_MODEL);
}

export type ClassifySnapshotsOptions = {
  id?: string;
  dryRun?: boolean;
};

export type ClassifySnapshotsSummary = {
  report: ClassifyReport;
  failures: string[];
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readRunReport(): RunReport | null {
  if (!fs.existsSync(RUN_REPORT_PATH)) {
    return null;
  }
  const raw = fs.readFileSync(RUN_REPORT_PATH, "utf8");
  return JSON.parse(raw) as RunReport;
}

function changeForId(report: RunReport, id: string): SnapshotChange | null {
  const result = report.results.find((entry) => entry.id === id);
  return result?.change ?? null;
}

function resolveWorkQueue(options: ClassifySnapshotsOptions): {
  ids: string[];
  runReport: RunReport | null;
} {
  if (options.id) {
    return { ids: [options.id], runReport: readRunReport() };
  }

  const runReport = readRunReport();
  if (!runReport) {
    throw new Error(
      `No run report at ${RUN_REPORT_PATH}. Run npm run snapshot:sources first.`,
    );
  }

  return { ids: runReport.changed, runReport };
}

async function classifyWithLlm(
  prompt: ClassificationPrompt,
): Promise<{ result: ReturnType<typeof parseLlmClassification>; raw: string }> {
  const raw = await callAnthropic({
    system: prompt.system,
    user: prompt.user,
    model: getClassifyModel(),
  });

  try {
    return { result: parseLlmClassification(raw), raw };
  } catch {
    const fixPrompt = buildFixJsonPrompt(prompt.user, raw);
    const fixedRaw = await callAnthropic({
      system: fixPrompt.system,
      user: fixPrompt.user,
      model: getClassifyModel(),
    });
    return { result: parseLlmClassification(fixedRaw), raw: fixedRaw };
  }
}

async function classifyChangedSource(
  id: string,
  dryRun: boolean,
): Promise<SourceClassification> {
  const source = getSourceById(id);
  if (!source) {
    return {
      id,
      status: "failed",
      classification: null,
      rationale: null,
      confidence: null,
      dependent_pages: [],
      error: `Unknown source id: ${id}`,
    };
  }

  const patchPath = snapshotDiffPath(id);
  if (!fs.existsSync(patchPath)) {
    return {
      id,
      status: "failed",
      classification: null,
      rationale: null,
      confidence: null,
      dependent_pages: source.dependent_pages,
      error: `Missing diff artifact: ${patchPath}`,
    };
  }

  const patch = fs.readFileSync(patchPath, "utf8");
  const { patch: truncatedPatch, truncated } = truncateDiff(patch);
  const stats = diffStats(patch);
  const prompt = buildClassificationPrompt({
    source,
    patch: truncatedPatch,
    diffTruncated: truncated,
  });

  if (dryRun) {
    return {
      id,
      status: "classified",
      classification: "material",
      rationale: "[dry-run] classification skipped",
      confidence: null,
      dependent_pages: source.dependent_pages,
      diff_stats: stats,
      diff_truncated: truncated,
    };
  }

  try {
    const { result } = await classifyWithLlm(prompt);
    return {
      id,
      status: "classified",
      classification: result.classification,
      rationale: result.rationale,
      confidence: result.confidence ?? null,
      dependent_pages: source.dependent_pages,
      diff_stats: stats,
      diff_truncated: truncated,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      id,
      status: "classified",
      classification: "material",
      rationale: `Parse/API failure; fail-safe to material: ${message}`,
      confidence: "low",
      dependent_pages: source.dependent_pages,
      diff_stats: stats,
      diff_truncated: truncated,
    };
  }
}

function buildBaselineEntry(id: string): SourceClassification {
  const source = getSourceById(id);
  return {
    id,
    status: "baseline",
    classification: null,
    rationale: null,
    confidence: null,
    dependent_pages: source?.dependent_pages ?? [],
  };
}

function buildSkippedEntry(id: string, reason: string): SourceClassification {
  const source = getSourceById(id);
  return {
    id,
    status: "skipped",
    classification: null,
    rationale: reason,
    confidence: null,
    dependent_pages: source?.dependent_pages ?? [],
  };
}

function summarize(sources: SourceClassification[]): ClassifyReport["summary"] {
  const summary = {
    material: 0,
    cosmetic: 0,
    baseline: 0,
    skipped: 0,
    failed: 0,
  };

  for (const entry of sources) {
    if (entry.status === "baseline") {
      summary.baseline += 1;
    } else if (entry.status === "skipped") {
      summary.skipped += 1;
    } else if (entry.status === "failed") {
      summary.failed += 1;
    } else if (entry.classification === "material") {
      summary.material += 1;
    } else if (entry.classification === "cosmetic") {
      summary.cosmetic += 1;
    }
  }

  return summary;
}

function needsLlmClassification(
  id: string,
  runReport: RunReport | null,
): boolean {
  const change = runReport ? changeForId(runReport, id) : null;
  if (change === "new" || change === "kept" || change === "unchanged") {
    return false;
  }
  if (change === null && !fs.existsSync(snapshotDiffPath(id))) {
    return false;
  }
  return fs.existsSync(snapshotDiffPath(id));
}

export async function classifySnapshots(
  options: ClassifySnapshotsOptions = {},
): Promise<ClassifySnapshotsSummary> {
  const dryRun = options.dryRun === true;
  const { ids, runReport } = resolveWorkQueue(options);

  const llmIds = ids.filter((id) => needsLlmClassification(id, runReport));
  if (!dryRun && llmIds.length > 0 && !process.env.ANTHROPIC_API_KEY?.trim()) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Export it, add it to .env, or use --dry-run.",
    );
  }

  const sources: SourceClassification[] = [];
  const failures: string[] = [];

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const change = runReport ? changeForId(runReport, id) : null;

    if (change === "new" || (change === null && !fs.existsSync(snapshotDiffPath(id)))) {
      sources.push(buildBaselineEntry(id));
    } else if (change === "kept" || change === "unchanged") {
      sources.push(buildSkippedEntry(id, `Snapshot change status: ${change ?? "unknown"}`));
    } else {
      const entry = await classifyChangedSource(id, dryRun);
      sources.push(entry);
      if (entry.status === "failed") {
        failures.push(entry.error ?? `Classification failed for ${id}`);
      }
    }

    if (index < ids.length - 1 && !dryRun) {
      await delay(FETCH_DELAY_MS);
    }
  }

  const report: ClassifyReport = {
    classified_at: new Date().toISOString(),
    dry_run: dryRun,
    model: getClassifyModel(),
    sources,
    summary: summarize(sources),
  };

  const validated = classifyReportSchema.parse(report);

  if (!dryRun) {
    fs.writeFileSync(
      CLASSIFY_REPORT_PATH,
      `${JSON.stringify(validated, null, 2)}\n`,
      "utf8",
    );
  }

  return { report: validated, failures };
}

/** Format a single classification for CLI logging. */
export function formatClassifyLine(entry: SourceClassification): string {
  if (entry.status === "baseline") {
    return `classify ${entry.id} baseline`;
  }
  if (entry.status === "skipped") {
    return `classify ${entry.id} skip`;
  }
  if (entry.status === "failed") {
    return `classify ${entry.id} failed ${entry.error ?? ""}`.trimEnd();
  }
  return `classify ${entry.id} ${entry.classification}`;
}
