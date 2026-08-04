import fs from "node:fs";
import path from "node:path";

import {
  classifySnapshots,
  formatClassifyLine,
  getClassifyModel,
} from "../src/classify";

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
  id?: string;
  dryRun: boolean;
};

function printHelp(): void {
  console.log(`Usage: npm run classify:snapshots [-- options]

Classify changed source snapshots as cosmetic or material (T16).

Options:
  --dry-run          Build prompts without calling the API or writing _classify.json
  --id=<sourceId>    Classify a single source (uses _diffs/{id}.patch)
  -h, --help         Show this help

Requires snapshots/_run.json from npm run snapshot:sources (unless --id with an existing patch).
Uses ANTHROPIC_API_KEY; optional CLASSIFY_MODEL (default ${getClassifyModel()}).
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false };

  for (const arg of argv) {
    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg.startsWith("--id=")) {
      options.id = arg.slice("--id=".length).trim();
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function main(): Promise<void> {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));

  const { report, failures } = await classifySnapshots({
    id: options.id,
    dryRun: options.dryRun,
  });

  for (const entry of report.sources) {
    console.log(formatClassifyLine(entry));
  }

  const { summary } = report;
  console.log(
    `Done: material=${summary.material} cosmetic=${summary.cosmetic} baseline=${summary.baseline} skipped=${summary.skipped} failed=${summary.failed}`,
  );

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
