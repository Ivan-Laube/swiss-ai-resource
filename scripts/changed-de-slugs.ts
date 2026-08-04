/**
 * List DE content slugs that need EN/FR/IT regeneration (T19).
 *
 * Prints one slug per line. Empty output + exit 0 means nothing to translate.
 *
 * Usage:
 *   npm run changed-de-slugs
 *   npm run changed-de-slugs -- --before=<sha> --to=<sha>
 *   npm run changed-de-slugs -- --slug=ndsg-ai-basics
 *   npm run changed-de-slugs -- --all
 *
 * Env (GitHub Actions push):
 *   GITHUB_EVENT_BEFORE, GITHUB_SHA — used when --before/--to omitted
 */

import { resolveChangedDeSlugs } from "../src/translate/changed-de";

type CliOptions = {
  slugs: string[];
  all: boolean;
  beforeRef?: string;
  afterRef?: string;
};

function printUsage(): void {
  console.error(`Usage:
  npm run changed-de-slugs [-- --before=<ref> --to=<ref>]
  npm run changed-de-slugs -- --slug=<slug>
  npm run changed-de-slugs -- --all

Options:
  --before=<ref>   Git ref before the change (default: GITHUB_EVENT_BEFORE or HEAD~1)
  --to=<ref>       Git ref after the change (default: GITHUB_SHA or HEAD)
  --slug=<slug>    Emit this publishable DE slug (repeatable; skips git diff)
  --all            Emit every publishable DE slug (skips git diff)
`);
}

function parseArgs(argv: string[]): CliOptions {
  let all = false;
  const slugs: string[] = [];
  let beforeRef: string | undefined;
  let afterRef: string | undefined;

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg.startsWith("--slug=")) {
      const slug = arg.slice("--slug=".length).trim();
      if (!slug) {
        throw new Error("Empty --slug value");
      }
      slugs.push(slug);
      continue;
    }
    if (arg.startsWith("--before=")) {
      beforeRef = arg.slice("--before=".length).trim();
      if (!beforeRef) {
        throw new Error("Empty --before value");
      }
      continue;
    }
    if (arg.startsWith("--to=")) {
      afterRef = arg.slice("--to=".length).trim();
      if (!afterRef) {
        throw new Error("Empty --to value");
      }
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (all && slugs.length > 0) {
    throw new Error("Use either --all or --slug, not both");
  }

  return { slugs, all, beforeRef, afterRef };
}

function defaultBeforeRef(): string {
  const fromEnv = process.env.GITHUB_EVENT_BEFORE;
  // Preserve GitHub's all-zero "before" SHA so the detector can treat it as no baseline.
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return "HEAD~1";
}

function defaultAfterRef(): string {
  return process.env.GITHUB_SHA?.trim() || "HEAD";
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));

  const slugs = resolveChangedDeSlugs({
    all: options.all,
    slugs: options.slugs.length > 0 ? options.slugs : undefined,
    beforeRef: options.beforeRef ?? defaultBeforeRef(),
    afterRef: options.afterRef ?? defaultAfterRef(),
  });

  for (const slug of slugs) {
    console.log(slug);
  }
}

main();
