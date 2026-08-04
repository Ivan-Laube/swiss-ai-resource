import fs from "node:fs";
import path from "node:path";

import { classifyReportSchema, type ClassifyReport } from "@/classify";
import {
  ACT_BRIEF_PATH,
  ACT_DIR,
  ACT_FAILURES_BRIEF_PATH,
  ACT_REPORT_PATH,
  buildFailuresSummary,
  CLASSIFY_REPORT_PATH,
  FETCH_DELAY_MS,
  readSnapshotText,
  RUN_REPORT_PATH,
  type RunReport,
  type SourceRunFailure,
} from "@/snapshot";
import { getSourceById } from "@/sources";
import {
  extractVendorFields,
  getVendorById,
  type ExtractSourceInput,
} from "@/vendors";

import {
  applyBumps,
  applyMaterialClears,
  applyVendorUpdates,
  utcDateString,
  type VendorMaterialPatch,
} from "./apply";
import {
  buildFailureBrief,
  buildIssueBody,
  buildIssueTitle,
  buildMaterialBrief,
  buildPrBody,
  buildPrTitle,
  PERSISTENT_FAILURE_THRESHOLD,
} from "./brief";
import { decideActActions, decideVendorActions } from "./decide";
import {
  actReportSchema,
  type ActReport,
  type ActVendorMaterial,
} from "./schema";

export type MaintainActOptions = {
  dryRun?: boolean;
  write?: boolean;
};

export type MaintainActSummary = {
  report: ActReport;
  issueTitle: string | null;
  issueBody: string | null;
  prTitle: string | null;
  prBody: string | null;
  failureBriefPath: string | null;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeFailures(report: RunReport): SourceRunFailure[] {
  if (Array.isArray(report.failures) && report.failures.length > 0) {
    return report.failures;
  }
  return buildFailuresSummary(report.results ?? []);
}

function readRunReport(): RunReport {
  if (!fs.existsSync(RUN_REPORT_PATH)) {
    throw new Error(
      `No run report at ${RUN_REPORT_PATH}. Run npm run snapshot:sources first.`,
    );
  }
  const raw = fs.readFileSync(RUN_REPORT_PATH, "utf8");
  const parsed = JSON.parse(raw) as RunReport;
  return {
    ...parsed,
    failures: normalizeFailures(parsed),
  };
}

function readClassifyReport(): ClassifyReport {
  if (!fs.existsSync(CLASSIFY_REPORT_PATH)) {
    throw new Error(
      `No classify report at ${CLASSIFY_REPORT_PATH}. Run npm run classify:snapshots first.`,
    );
  }
  const raw = fs.readFileSync(CLASSIFY_REPORT_PATH, "utf8");
  return classifyReportSchema.parse(JSON.parse(raw) as unknown);
}

function toRepoRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).split(path.sep).join("/");
}

function loadExtractSources(sourceIds: string[]): ExtractSourceInput[] {
  const sources: ExtractSourceInput[] = [];
  for (const id of sourceIds) {
    const source = getSourceById(id);
    if (!source) {
      continue;
    }
    const text = readSnapshotText(id);
    if (text === null) {
      continue;
    }
    sources.push({ id, url: source.url, text });
  }
  return sources;
}

async function runVendorExtracts(options: {
  material: Array<{ vendor_id: string; source_ids: string[] }>;
  dryRun: boolean;
}): Promise<{
  vendorsMaterial: ActVendorMaterial[];
  patches: VendorMaterialPatch[];
}> {
  const vendorsMaterial: ActVendorMaterial[] = [];
  const patches: VendorMaterialPatch[] = [];

  for (let index = 0; index < options.material.length; index += 1) {
    const action = options.material[index];
    const vendor = getVendorById(action.vendor_id);
    if (!vendor) {
      vendorsMaterial.push({
        vendor_id: action.vendor_id,
        source_ids: action.source_ids,
        fields_changed: [],
        extract_error: `Unknown vendor id: ${action.vendor_id}`,
      });
      continue;
    }

    const evidence = loadExtractSources(action.source_ids);
    if (evidence.length === 0) {
      vendorsMaterial.push({
        vendor_id: action.vendor_id,
        source_ids: action.source_ids,
        fields_changed: [],
        extract_error: "No snapshot text available for material sources",
      });
      continue;
    }

    const result = await extractVendorFields({
      vendor,
      sources: evidence,
      dryRun: options.dryRun,
    });

    vendorsMaterial.push({
      vendor_id: action.vendor_id,
      source_ids: action.source_ids,
      fields_changed: result.fields_changed,
      extract_error: result.error,
      rationale: result.rationale,
    });

    // On extract error with no fields, still surface in brief but do not bump.
    const bumpLastChecked = result.error === undefined;
    if (
      result.fields_changed.length > 0 ||
      (bumpLastChecked && !options.dryRun)
    ) {
      patches.push({
        vendor_id: action.vendor_id,
        fields: result.fields,
        bump_last_checked: bumpLastChecked,
      });
    }

    if (index < options.material.length - 1 && !options.dryRun) {
      await delay(FETCH_DELAY_MS);
    }
  }

  return { vendorsMaterial, patches };
}

/**
 * Consume T15/T16 artifacts and apply last_verified bumps / material review clears /
 * vendor last_checked bumps / material vendor field extracts (T17 + T18).
 */
export async function maintainAct(
  options: MaintainActOptions = {},
): Promise<MaintainActSummary> {
  const dryRun = options.dryRun === true;
  // --write is the mutate path; dry-run never writes. Default without flags: dry-run-safe no-write.
  const shouldWrite = options.write === true && !dryRun;

  const runReport = readRunReport();
  const classifyReport = readClassifyReport();
  const decision = decideActActions(runReport, classifyReport);
  const vendorDecision = decideVendorActions(runReport, classifyReport);
  const verifiedDate = utcDateString();

  if (
    vendorDecision.material.length > 0 &&
    !dryRun &&
    shouldWrite &&
    !process.env.ANTHROPIC_API_KEY?.trim()
  ) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Export it, add it to .env, or use --dry-run (vendor material extract requires the API).",
    );
  }

  const { vendorsMaterial, patches } = await runVendorExtracts({
    material: vendorDecision.material,
    dryRun: dryRun || !shouldWrite,
  });

  let bumpedFiles: string[] = [];
  let materialFiles: string[] = [];
  let vendorFiles: string[] = [];
  let briefPath: string | null = null;
  let failureBriefPath: string | null = null;
  let issueTitle: string | null = null;
  let issueBody: string | null = null;
  let prTitle: string | null = null;
  let prBody: string | null = null;

  const failures = runReport.failures;
  const hasPersistentFailures = failures.some(
    (f) => f.consecutive_failures >= PERSISTENT_FAILURE_THRESHOLD,
  );

  const hasMaterial =
    decision.material.length > 0 || vendorsMaterial.length > 0;

  if (hasMaterial) {
    const brief = buildMaterialBrief({
      verifiedDate,
      decision,
      vendorDecision,
      vendorsMaterial,
      classifyReport,
      failures,
    });
    issueTitle = buildIssueTitle(verifiedDate);
    issueBody = buildIssueBody(brief);
    prTitle = buildPrTitle(verifiedDate);
    prBody = buildPrBody({ verifiedDate, decision, vendorsMaterial });

    if (shouldWrite) {
      fs.mkdirSync(ACT_DIR, { recursive: true });
      fs.writeFileSync(ACT_BRIEF_PATH, brief, "utf8");
      const prBodyPath = path.join(ACT_DIR, "pr-body.md");
      fs.writeFileSync(prBodyPath, prBody, "utf8");
      briefPath = toRepoRelative(ACT_BRIEF_PATH);
      materialFiles = applyMaterialClears(decision.material);
      materialFiles = [
        ...new Set([
          ...materialFiles,
          briefPath,
          toRepoRelative(prBodyPath),
        ]),
      ].sort();
    } else {
      briefPath = toRepoRelative(ACT_BRIEF_PATH);
    }
  }

  if (hasPersistentFailures) {
    const failureBrief = buildFailureBrief({ verifiedDate, failures });
    failureBriefPath = toRepoRelative(ACT_FAILURES_BRIEF_PATH);
    if (shouldWrite) {
      fs.mkdirSync(ACT_DIR, { recursive: true });
      fs.writeFileSync(ACT_FAILURES_BRIEF_PATH, failureBrief, "utf8");
    }
  } else if (shouldWrite && fs.existsSync(ACT_FAILURES_BRIEF_PATH)) {
    fs.unlinkSync(ACT_FAILURES_BRIEF_PATH);
  }

  if (shouldWrite && decision.bumped.length > 0) {
    bumpedFiles = applyBumps(decision.bumped, verifiedDate);
  }

  // Vendor file writes: when any material vendors exist, all vendor updates
  // (including non-material last_checked bumps) go into the review PR path.
  if (shouldWrite) {
    const materialOwnsVendors = vendorsMaterial.length > 0;
    const bumpsForMain = materialOwnsVendors ? [] : vendorDecision.bumped;
    const bumpsForMaterial = materialOwnsVendors ? vendorDecision.bumped : [];

    if (materialOwnsVendors) {
      vendorFiles = applyVendorUpdates({
        bumps: bumpsForMaterial,
        patches,
        checkedDate: verifiedDate,
      });
      if (vendorFiles.length > 0) {
        materialFiles = [...new Set([...materialFiles, ...vendorFiles])].sort();
      }
    } else if (bumpsForMain.length > 0) {
      vendorFiles = applyVendorUpdates({
        bumps: bumpsForMain,
        patches: [],
        checkedDate: verifiedDate,
      });
    }
  }

  const report: ActReport = actReportSchema.parse({
    acted_at: new Date().toISOString(),
    dry_run: dryRun || !shouldWrite,
    verified_date: verifiedDate,
    bumped: decision.bumped,
    material: decision.material,
    skipped_slugs: decision.skipped_slugs,
    bumped_files: bumpedFiles,
    material_files: materialFiles,
    brief_path: briefPath,
    vendors_bumped: vendorDecision.bumped,
    vendors_material: vendorsMaterial,
    vendors_skipped: vendorDecision.skipped,
    vendor_files: vendorFiles,
    summary: {
      bumped: decision.bumped.length,
      material: decision.material.length,
      skipped: decision.skipped_slugs.length,
      bumped_files: bumpedFiles.length,
      material_files: materialFiles.length,
      vendors_bumped: vendorDecision.bumped.length,
      vendors_material: vendorsMaterial.length,
      vendors_skipped: vendorDecision.skipped.length,
      vendor_files: vendorFiles.length,
    },
  });

  if (shouldWrite) {
    fs.mkdirSync(path.dirname(ACT_REPORT_PATH), { recursive: true });
    fs.writeFileSync(
      ACT_REPORT_PATH,
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8",
    );
  }

  return { report, issueTitle, issueBody, prTitle, prBody, failureBriefPath };
}

/** Format a one-line summary for CLI logging. */
export function formatActSummary(report: ActReport): string {
  const { summary } = report;
  return [
    `Done: bumped=${summary.bumped} material=${summary.material} skipped=${summary.skipped}`,
    `files_bumped=${summary.bumped_files} files_material=${summary.material_files}`,
    `vendors_bumped=${summary.vendors_bumped} vendors_material=${summary.vendors_material}`,
    `vendors_skipped=${summary.vendors_skipped} vendor_files=${summary.vendor_files}`,
  ].join(" ");
}
