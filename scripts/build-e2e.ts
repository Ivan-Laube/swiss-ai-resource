/**
 * Build two static exports for Playwright e2e:
 * - out-e2e/              configured (SCAN_API_URL + TURNSTILE_SITE_KEY + SURVEY_API_URL)
 * - out-e2e-unconfigured/ both NEXT_PUBLIC_* empty → "unavailable" UI
 *
 * The configured build swaps in a populated survey-aggregates fixture so the
 * benchmark page has publishable cells; the unconfigured build keeps the
 * committed empty snapshot (empty benchmark state).
 *
 * Uses spawnSync so env overrides work on Windows and in CI.
 * Invokes `next build` (triggers prebuild + postbuild via npm lifecycle)
 * by calling the local next binary directly, then copying `out/`.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const AGGREGATES_PATH = path.join(ROOT, "data", "survey-aggregates.json");
const POPULATED_FIXTURE = path.join(
  ROOT,
  "e2e",
  "fixtures",
  "survey-aggregates.populated.json",
);
const NEXT_BIN = path.join(
  ROOT,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

type BuildTarget = {
  dest: string;
  env: Record<string, string>;
  label: string;
  /** When true, temporarily replace aggregates with the populated fixture. */
  usePopulatedAggregates: boolean;
};

const TARGETS: BuildTarget[] = [
  {
    label: "configured",
    dest: path.join(ROOT, "out-e2e"),
    usePopulatedAggregates: true,
    env: {
      NEXT_PUBLIC_SCAN_API_URL: "https://api.aicompliant.ch",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      NEXT_PUBLIC_SURVEY_API_URL: "https://api.aicompliant.ch",
    },
  },
  {
    label: "unconfigured",
    dest: path.join(ROOT, "out-e2e-unconfigured"),
    usePopulatedAggregates: false,
    env: {
      NEXT_PUBLIC_SCAN_API_URL: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
      NEXT_PUBLIC_SURVEY_API_URL: "",
    },
  },
];

function run(command: string, args: string[], env: NodeJS.ProcessEnv): void {
  // Avoid shell:true with absolute paths that contain spaces (e.g. "Swiss AI").
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function buildOne(target: BuildTarget): void {
  console.log(`\n=== E2E build: ${target.label} → ${path.basename(target.dest)} ===\n`);

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    ...target.env,
  };

  let aggregatesBackup: string | null = null;
  if (target.usePopulatedAggregates) {
    if (!existsSync(POPULATED_FIXTURE)) {
      console.error(
        `Missing ${POPULATED_FIXTURE}; run npx tsx scripts/generate-e2e-survey-aggregates.ts`,
      );
      process.exit(1);
    }
    aggregatesBackup = readFileSync(AGGREGATES_PATH, "utf8");
    copyFileSync(POPULATED_FIXTURE, AGGREGATES_PATH);
    console.log("Installed populated survey-aggregates fixture for build");
  }

  try {
    // Sync aggregates + next build + csp-hashes (skip npm lifecycle to control env).
    // Note: sync:survey-aggregates may overwrite with remote data; for e2e we
    // re-apply the fixture after sync when using populated aggregates.
    run(process.execPath, [
      path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
      path.join(ROOT, "scripts", "sync-survey-aggregates.ts"),
    ], env);

    if (target.usePopulatedAggregates) {
      copyFileSync(POPULATED_FIXTURE, AGGREGATES_PATH);
      console.log("Re-applied populated fixture after sync");
    } else if (aggregatesBackup !== null) {
      writeFileSync(AGGREGATES_PATH, aggregatesBackup);
    }

    run(process.execPath, [NEXT_BIN, "build"], env);
    run(process.execPath, [
      path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
      path.join(ROOT, "scripts", "csp-hashes.ts"),
    ], env);
  } finally {
    if (aggregatesBackup !== null) {
      writeFileSync(AGGREGATES_PATH, aggregatesBackup);
      console.log("Restored committed survey-aggregates.json");
    }
  }

  if (!existsSync(OUT)) {
    console.error(`Expected ${OUT} after next build`);
    process.exit(1);
  }

  rmSync(target.dest, { recursive: true, force: true });
  mkdirSync(path.dirname(target.dest), { recursive: true });
  cpSync(OUT, target.dest, { recursive: true });
  console.log(`Copied out/ → ${path.basename(target.dest)}`);
}

function main(): void {
  if (!existsSync(NEXT_BIN)) {
    console.error(`next binary not found at ${NEXT_BIN}; run npm ci first`);
    process.exit(1);
  }

  for (const target of TARGETS) {
    buildOne(target);
  }

  console.log("\nE2E builds ready: out-e2e/, out-e2e-unconfigured/");
}

main();
