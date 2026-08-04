import {
  formatResultLine,
  runSnapshots,
} from "../src/snapshot";

type CliOptions = {
  id: string | undefined;
  dryRun: boolean;
  seedFile: string | undefined;
};

function parseArgs(argv: string[]): CliOptions {
  let id: string | undefined;
  let dryRun = false;
  let seedFile: string | undefined;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg.startsWith("--id=")) {
      id = arg.slice("--id=".length).trim();
      if (!id) {
        throw new Error("--id= requires a non-empty source id");
      }
      continue;
    }
    if (arg.startsWith("--seed-file=")) {
      seedFile = arg.slice("--seed-file=".length).trim();
      if (!seedFile) {
        throw new Error("--seed-file= requires a non-empty path");
      }
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (seedFile !== undefined && !id) {
    throw new Error("--seed-file requires --id=<sourceId>");
  }

  return { id, dryRun, seedFile };
}

function printHelp(): void {
  console.log(`Usage: npm run snapshot:sources -- [options]

Options:
  --dry-run              Fetch and report without writing snapshot files
  --id=<sourceId>        Process a single source from data/sources.json
  --seed-file=<path>     Seed snapshot from a local HTML/PDF (requires --id)
  -h, --help             Show this help

T38: when a source is permanently bot-blocked, save the page in a browser and
seed it once so the next monthly run has a baseline to diff against:
  npm run snapshot:sources -- --id=openai-dpa --seed-file=./openai-dpa.html
`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const { report, results } = await runSnapshots({
    id: options.id,
    dryRun: options.dryRun,
    seedFile: options.seedFile,
  });

  for (const result of results) {
    console.log(formatResultLine(result));
  }

  const mode = options.dryRun
    ? " (dry-run)"
    : options.seedFile
      ? " (seeded)"
      : "";
  console.log(
    `\nDone: ${report.ok}/${report.total} ok, ${report.failed} failed, ${report.changed.length} changed${mode}`,
  );
  if (report.failures.length > 0) {
    console.log(
      `Failures: ${report.failures.map((f) => `${f.id}×${f.consecutive_failures}`).join(", ")}`,
    );
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
