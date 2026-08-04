import fs from "node:fs";

import type { ClassifyReport, SourceClassification } from "@/classify";
import { getSourceById } from "@/sources";
import { snapshotDiffPath, type SourceRunFailure } from "@/snapshot";

import type { ActDecision, VendorActDecision } from "./decide";
import type { ActVendorMaterial } from "./schema";

const PATCH_EXCERPT_MAX = 4000;

/** Open a standalone GitHub issue from the second consecutive failure onward. */
export const PERSISTENT_FAILURE_THRESHOLD = 2;

function monthLabel(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function materialClassifications(
  classifyReport: ClassifyReport,
  sourceIds: Set<string>,
): SourceClassification[] {
  return classifyReport.sources.filter(
    (entry) =>
      sourceIds.has(entry.id) &&
      entry.status === "classified" &&
      entry.classification === "material",
  );
}

function patchExcerpt(sourceId: string): string {
  const patchPath = snapshotDiffPath(sourceId);
  if (!fs.existsSync(patchPath)) {
    return "_No patch file found._";
  }
  const raw = fs.readFileSync(patchPath, "utf8");
  if (raw.length <= PATCH_EXCERPT_MAX) {
    return raw;
  }
  return `${raw.slice(0, PATCH_EXCERPT_MAX)}\n\n… truncated …`;
}

function formatFailureLines(failures: SourceRunFailure[]): string[] {
  const lines: string[] = [];
  for (const failure of failures) {
    const source = getSourceById(failure.id);
    const vendor = source?.vendor_id ? `\`${source.vendor_id}\`` : "(none)";
    const pages =
      source && source.dependent_pages.length > 0
        ? source.dependent_pages.map((s) => `\`${s}\``).join(", ")
        : "(none)";
    const lastOk = failure.last_ok_at ?? "never / unknown";
    lines.push(`### \`${failure.id}\``);
    lines.push("");
    lines.push(
      `- **HTTP:** ${failure.http_status === null ? "n/a" : failure.http_status}`,
    );
    lines.push(`- **Error:** ${failure.error}`);
    lines.push(`- **Consecutive failures:** ${failure.consecutive_failures}`);
    lines.push(`- **Last ok:** ${lastOk}`);
    lines.push(`- **Vendor:** ${vendor}`);
    lines.push(`- **Dependent pages:** ${pages}`);
    if (source && source.fallback_urls.length > 0) {
      lines.push(
        `- **Configured fallbacks:** ${source.fallback_urls.map((u) => `\`${u}\``).join(", ")}`,
      );
    }
    lines.push(
      `- **Hint:** add a \`fallback_urls\` entry in \`data/sources.json\`, or seed manually: \`npm run snapshot:sources -- --id=${failure.id} --seed-file=<path>\``,
    );
    lines.push("");
  }
  return lines;
}

/** Editorial brief for material changes (issue + PR body source). */
export function buildMaterialBrief(options: {
  verifiedDate: string;
  decision: ActDecision;
  vendorDecision: VendorActDecision;
  vendorsMaterial: ActVendorMaterial[];
  classifyReport: ClassifyReport;
  failures?: SourceRunFailure[];
}): string {
  const {
    verifiedDate,
    decision,
    vendorDecision,
    vendorsMaterial,
    classifyReport,
    failures = [],
  } = options;
  const sourceIds = new Set([
    ...decision.material.flatMap((action) => action.source_ids),
    ...vendorsMaterial.flatMap((action) => action.source_ids),
  ]);
  const entries = materialClassifications(classifyReport, sourceIds);

  const lines: string[] = [
    `# Material source changes (${monthLabel(verifiedDate)})`,
    "",
    "Automated T17/T18 brief from the monthly source job. **Not legal advice.**",
    "Review the diffs, update DE cornerstone prose and/or vendor table cells as needed, then merge.",
    "Merging clears the lawyer review badge on affected DE pages (if set).",
    "",
  ];

  if (decision.material.length > 0) {
    lines.push("## Affected pages", "");
    for (const action of decision.material) {
      lines.push(
        `- \`${action.slug}\` — sources: ${action.source_ids.map((id) => `\`${id}\``).join(", ")}`,
      );
    }
    lines.push("");
  }

  if (vendorsMaterial.length > 0) {
    lines.push("## Vendor table", "");
    lines.push(
      "Material vendor sources triggered structured field extraction into `data/vendors.json`.",
      "Review proposed claim cells before merge. Identity fields (`id` / `name` / `website`) are never auto-changed.",
      "",
    );
    for (const action of vendorsMaterial) {
      const fields =
        action.fields_changed.length > 0
          ? action.fields_changed.map((f) => `\`${f}\``).join(", ")
          : "(no claim fields changed)";
      lines.push(`- \`${action.vendor_id}\``);
      lines.push(
        `  - sources: ${action.source_ids.map((id) => `\`${id}\``).join(", ")}`,
      );
      lines.push(`  - fields changed: ${fields}`);
      if (action.extract_error) {
        lines.push(`  - extract error: ${action.extract_error}`);
      }
      if (action.rationale) {
        lines.push(`  - extract rationale: ${action.rationale}`);
      }
    }
    lines.push("");
  }

  lines.push("## Per-source classifications", "");

  for (const entry of entries) {
    lines.push(`### \`${entry.id}\``);
    lines.push("");
    lines.push(`- **Confidence:** ${entry.confidence ?? "n/a"}`);
    lines.push(
      `- **Dependent pages:** ${entry.dependent_pages.map((s) => `\`${s}\``).join(", ") || "(none)"}`,
    );
    lines.push(`- **Rationale:** ${entry.rationale ?? "(none)"}`);
    lines.push(`- **Patch:** \`snapshots/_diffs/${entry.id}.patch\``);
    lines.push("");
    lines.push("```diff");
    lines.push(patchExcerpt(entry.id).trimEnd());
    lines.push("```");
    lines.push("");
  }

  if (failures.length > 0) {
    lines.push("## Fetch failures", "");
    lines.push(
      "These sources kept their previous snapshot (`change: kept`). Vendor refresh (T18) and `last_verified` bumps skip them — do not leave rows to rot.",
      "",
    );
    lines.push(...formatFailureLines(failures));
  }

  lines.push("## Editor checklist", "");
  lines.push("- [ ] Read each patch and rationale above");
  if (decision.material.length > 0) {
    lines.push(
      "- [ ] Update affected DE markdown bodies where obligations/dates/terms changed",
    );
    lines.push(
      "- [ ] Confirm `last_verified` after human verification (not auto-bumped for material)",
    );
    lines.push(
      "- [ ] Request lawyer re-review (T29) if the page previously carried a badge",
    );
  }
  if (vendorsMaterial.length > 0 || vendorDecision.material.length > 0) {
    lines.push("- [ ] Review `data/vendors.json` claim cells and sources");
    lines.push(
      "- [ ] Confirm `last_checked` and leave unverified cells as `{ value: null, source_url: null }` when evidence is weak",
    );
  }
  if (failures.length > 0) {
    lines.push(
      "- [ ] For each fetch failure: try a browser-reachable alternate URL as `fallback_urls`, or seed a local snapshot",
    );
    lines.push(
      "- [ ] Confirm skipped vendors (`vendors_skipped` in `_act.json`) are not silently stale",
    );
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

/**
 * Standalone brief for persistent fetch failures (T38).
 * Written when any source has consecutive_failures >= PERSISTENT_FAILURE_THRESHOLD.
 */
export function buildFailureBrief(options: {
  verifiedDate: string;
  failures: SourceRunFailure[];
}): string {
  const { verifiedDate, failures } = options;
  const persistent = failures.filter(
    (f) => f.consecutive_failures >= PERSISTENT_FAILURE_THRESHOLD,
  );

  const lines: string[] = [
    `# Snapshot fetch failures (${monthLabel(verifiedDate)})`,
    "",
    "Automated T38 brief from the monthly source job.",
    "These sources failed on consecutive runs and are **skipped** by Act (no silent invent of vendor cells or `last_verified` bumps).",
    "",
    `Persistent failures (≥${PERSISTENT_FAILURE_THRESHOLD} consecutive): **${persistent.length}**.`,
    `All failures this run: **${failures.length}**.`,
    "",
  ];

  if (persistent.length === 0) {
    lines.push("_No persistent failures._", "");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Persistent failures", "");
  lines.push(...formatFailureLines(persistent));

  const firstMonth = failures.filter(
    (f) => f.consecutive_failures < PERSISTENT_FAILURE_THRESHOLD,
  );
  if (firstMonth.length > 0) {
    lines.push("## First-month failures (no issue noise yet)", "");
    lines.push(
      "Listed for visibility; a GitHub issue is only opened from the second consecutive month.",
      "",
    );
    for (const f of firstMonth) {
      lines.push(
        `- \`${f.id}\` — HTTP ${f.http_status ?? "n/a"} — consecutive=${f.consecutive_failures} — ${f.error}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Editor checklist",
    "",
    "- [ ] Open each primary URL in a browser; confirm it still exists",
    "- [ ] Add a stable `fallback_urls` entry in `data/sources.json` when an alternate page carries the same claims",
    "- [ ] Or seed: `npm run snapshot:sources -- --id=<id> --seed-file=<saved.html|pdf>`",
    "- [ ] Re-run `npm run snapshot:sources -- --id=<id>` and confirm `ok` before the next monthly cron",
    "",
  );

  return `${lines.join("\n")}\n`;
}

export function buildFailureIssueTitle(verifiedDate: string): string {
  return `Snapshot fetch failures (${monthLabel(verifiedDate)})`;
}

export function buildIssueTitle(verifiedDate: string): string {
  return `Material source changes (${monthLabel(verifiedDate)})`;
}

export function buildIssueBody(brief: string): string {
  return brief;
}

export function buildPrTitle(verifiedDate: string): string {
  return `review: material source changes (${monthLabel(verifiedDate)})`;
}

export function buildPrBody(options: {
  verifiedDate: string;
  decision: ActDecision;
  vendorsMaterial: ActVendorMaterial[];
  issueUrl?: string;
}): string {
  const { verifiedDate, decision, vendorsMaterial, issueUrl } = options;
  const lines: string[] = [
    `## Summary`,
    "",
    `Monthly T17/T18 material-change PR for **${monthLabel(verifiedDate)}**.`,
    "",
    "This PR:",
  ];

  if (decision.material.length > 0) {
    lines.push(
      "- Clears lawyer review fields (`reviewed_by` / `review_date` / `review_scope`) on affected DE pages when they were set",
    );
  }
  if (vendorsMaterial.length > 0) {
    lines.push(
      "- Proposes vendor claim-field updates in `data/vendors.json` (T18 structured extract)",
    );
  }
  lines.push(
    "- Includes `snapshots/_act/material-brief.md` with classifier rationales and patch excerpts",
    "- Does **not** auto-rewrite legal prose — edit DE content before merge",
    "",
  );

  if (issueUrl) {
    lines.push(`Tracking issue: ${issueUrl}`, "");
  }

  if (decision.material.length > 0) {
    lines.push("### Affected DE pages", "");
    for (const action of decision.material) {
      lines.push(`- \`content/de/${action.slug}.md\``);
    }
    lines.push("");
  }

  if (vendorsMaterial.length > 0) {
    lines.push("### Vendor updates", "");
    lines.push("- `data/vendors.json`");
    for (const action of vendorsMaterial) {
      const fields =
        action.fields_changed.length > 0
          ? action.fields_changed.join(", ")
          : "last_checked / review only";
      lines.push(`  - \`${action.vendor_id}\`: ${fields}`);
    }
    lines.push("");
  }

  lines.push(
    "### Checklist",
    "",
    "- [ ] Review brief and patches",
  );
  if (decision.material.length > 0) {
    lines.push("- [ ] Update DE cornerstone content where needed");
    lines.push("- [ ] Set `last_verified` after human verification");
    lines.push(
      "- [ ] Merge clears the lawyer badge lifecycle (T17); re-review restores it (T29)",
    );
  }
  if (vendorsMaterial.length > 0) {
    lines.push("- [ ] Review vendor claim cells and source URLs");
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}
