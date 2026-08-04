import fs from "node:fs";
import path from "node:path";

import {
  formatActSummary,
  maintainAct,
} from "../src/maintain";

function loadDotEnv(): void {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

type CliOptions = {
  dryRun: boolean;
  write: boolean;
};

function printHelp(): void {
  console.log(`Usage: npm run maintain:act [-- options]

Act on T15/T16 artifacts: bump last_verified / last_checked, or open material
review paths for content + vendor field extracts (T17 + T18).

Options:
  --write       Apply changes and write snapshots/_act.json (+ brief)
  --dry-run     Report decisions without writing (overrides --write)
  -h, --help    Show this help

Requires snapshots/_run.json and snapshots/_classify.json.
Material vendor extracts need ANTHROPIC_API_KEY (unless --dry-run).
CI uses: npm run maintain:act -- --write
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false, write: false };

  for (const arg of argv) {
    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--write") {
      options.write = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function main(): Promise<void> {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));

  const { report, issueTitle, prTitle, failureBriefPath } = await maintainAct({
    dryRun: options.dryRun,
    write: options.write,
  });

  for (const action of report.bumped) {
    console.log(
      `bump ${action.slug} (${action.reason}) ← ${action.source_ids.join(", ")}`,
    );
  }
  for (const action of report.material) {
    console.log(
      `material ${action.slug} ← ${action.source_ids.join(", ")}`,
    );
  }
  for (const slug of report.skipped_slugs) {
    console.log(`skip ${slug}`);
  }
  for (const action of report.vendors_bumped) {
    console.log(
      `vendor-bump ${action.vendor_id} (${action.reason}) ← ${action.source_ids.join(", ")}`,
    );
  }
  for (const action of report.vendors_material) {
    const fields =
      action.fields_changed.length > 0
        ? action.fields_changed.join(", ")
        : "none";
    console.log(
      `vendor-material ${action.vendor_id} fields=[${fields}] ← ${action.source_ids.join(", ")}`,
    );
    if (action.extract_error) {
      console.log(`  extract-error: ${action.extract_error}`);
    }
  }
  for (const vendorId of report.vendors_skipped) {
    console.log(`vendor-skip ${vendorId}`);
  }

  if (issueTitle) {
    console.log(`issue: ${issueTitle}`);
  }
  if (prTitle) {
    console.log(`pr: ${prTitle}`);
  }
  if (failureBriefPath) {
    console.log(`fetch-failures: ${failureBriefPath}`);
  }

  console.log(formatActSummary(report));

  if (!options.write && !options.dryRun) {
    console.log("No files written (pass --write to apply).");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
