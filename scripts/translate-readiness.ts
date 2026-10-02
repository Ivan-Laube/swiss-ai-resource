/**
 * Translate the readiness check texts in data/readiness-check.json (T51).
 * DE is canonical. Same model and glossary as the guide pipeline; every
 * batch is checked (same ids, placeholders kept, no HTML) before it is
 * written, and the file is validated afterwards.
 *
 *   npm run translate:readiness -- --dry-run
 *   npm run translate:readiness                    # fill missing EN/FR/IT
 *   npm run translate:readiness -- --base=<ref>    # also re-translate strings whose DE changed since <ref>
 *   npm run translate:readiness -- --locale=fr
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { READINESS_CHECK_PATH, loadReadinessCheck } from "../src/readiness/load";
import {
  getTranslateModel,
  matchGlossaryTerms,
  requireAnthropicApiKey,
  translateWithAnthropic,
  verifyGlossaryTermsInTranslation,
  type TranslateTargetLocale,
} from "../src/translate";
import {
  applyTranslations,
  buildReadinessPrompt,
  collectStrings,
  parseReadinessTranslation,
  stringsToTranslate,
} from "../src/translate/readiness";

const TARGETS: TranslateTargetLocale[] = ["en", "fr", "it"];
const BATCH_SIZE = 40;

function loadDotEnv(): void {
  for (const name of [".env", ".env.local"]) {
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
      }
    }
  }
}

function parseArgs(argv: string[]) {
  const locales: TranslateTargetLocale[] = [];
  let base: string | null = null;
  let dryRun = false;
  let strict = false;
  for (const arg of argv) {
    if (arg.startsWith("--locale=")) {
      const locale = arg.slice("--locale=".length) as TranslateTargetLocale;
      if (!TARGETS.includes(locale)) throw new Error(`Unknown target locale: ${locale}`);
      locales.push(locale);
    } else if (arg.startsWith("--base=")) base = arg.slice("--base=".length);
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--strict") strict = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { locales: locales.length > 0 ? locales : TARGETS, base, dryRun, strict };
}

/** The data file at a git ref, or null if it didn't exist there. */
function fileAtRef(ref: string): unknown | null {
  const rel = path.relative(process.cwd(), READINESS_CHECK_PATH).split(path.sep).join("/");
  try {
    return JSON.parse(execFileSync("git", ["show", `${ref}:${rel}`], { encoding: "utf8" }));
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));
  const data: unknown = JSON.parse(fs.readFileSync(READINESS_CHECK_PATH, "utf8"));
  const entries = collectStrings(data);
  const previousData = options.base ? fileAtRef(options.base) : null;
  const previous = previousData ? collectStrings(previousData) : undefined;

  let changed = 0;
  let glossaryMisses = 0;
  for (const locale of options.locales) {
    const todo = stringsToTranslate(entries, locale, previous);
    console.log(`→ ${locale}: ${todo.length} string${todo.length === 1 ? "" : "s"} to translate`);
    if (todo.length === 0 || options.dryRun) continue;

    requireAnthropicApiKey();
    for (let i = 0; i < todo.length; i += BATCH_SIZE) {
      const batch = todo.slice(i, i + BATCH_SIZE);
      const terms = matchGlossaryTerms("", "", batch.map((e) => e.de).join("\n"));
      const prompt = buildReadinessPrompt(locale, batch, terms);
      console.log(`  batch ${i / BATCH_SIZE + 1}: ${batch.length} strings (${getTranslateModel()})`);
      const translations = parseReadinessTranslation(await translateWithAnthropic(prompt), batch);
      applyTranslations(data, locale, batch, translations);
      changed += batch.length;

      const glossary = verifyGlossaryTermsInTranslation(
        locale,
        "",
        "",
        Object.values(translations).join("\n"),
        terms,
      );
      for (const miss of glossary.missing) console.warn(`  glossary warning: ${miss}`);
      glossaryMisses += glossary.missing.length;
    }
  }

  if (options.dryRun || changed === 0) {
    console.log(options.dryRun ? "Dry-run complete." : "Nothing to translate.");
    return;
  }
  fs.writeFileSync(READINESS_CHECK_PATH, `${JSON.stringify(data, null, 2)}\n`);
  loadReadinessCheck(); // throws if the written file is invalid
  console.log(`Wrote ${changed} translation${changed === 1 ? "" : "s"} to ${path.relative(process.cwd(), READINESS_CHECK_PATH)}.`);
  if (options.strict && glossaryMisses > 0) {
    console.error(`strict: ${glossaryMisses} glossary term(s) missing`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
