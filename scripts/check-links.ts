import {
  checkLinks,
  formatLinksSummary,
} from "../src/links";

type CliOptions = {
  dryRun: boolean;
  write: boolean;
};

function printHelp(): void {
  console.log(`Usage: npm run check:links [-- options]

Probe published citation URLs (content, vendors, rules) for reachability (T21).
Reuses T15 snapshots/_run.json results when the same URL was already fetched.

Options:
  --write       Write snapshots/_links.json and snapshots/_links/brief.md
  --dry-run     Probe and report without writing (overrides --write)
  -h, --help    Show this help

Exits 0 even when broken links are found (soft-fail for the monthly job).
CI uses: npm run check:links -- --write
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
  const options = parseArgs(process.argv.slice(2));

  const { report, issueTitle, briefPath } = await checkLinks({
    dryRun: options.dryRun,
    write: options.write,
  });

  for (const result of report.results) {
    if (result.ok) {
      continue;
    }
    const status =
      result.http_status !== null ? String(result.http_status) : "n/a";
    const reused = result.reused_from_run ? " reused" : "";
    console.log(
      `broken ${result.url} (${status}${reused})${result.error ? ` — ${result.error}` : ""}`,
    );
  }

  if (issueTitle) {
    console.log(`issue: ${issueTitle}`);
  }
  if (briefPath) {
    console.log(`brief: ${briefPath}`);
  }

  console.log(formatLinksSummary(report));

  if (!options.write && !options.dryRun) {
    console.log("No files written (pass --write to apply).");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
