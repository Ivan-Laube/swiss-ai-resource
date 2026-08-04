import fs from "node:fs";
import path from "node:path";

import {
  getContentPage,
  isPublishableSlug,
  listPublishableContentSlugs,
} from "../src/content/load";
import { isLocale } from "../src/i18n/config";
import {
  buildTranslationPrompt,
  getTranslateModel,
  matchGlossaryTerms,
  parseLlmTranslation,
  requireAnthropicApiKey,
  translateWithAnthropic,
  translationOutputPath,
  verifyGlossaryTermsInTranslation,
  writeTranslation,
  type TranslateTargetLocale,
} from "../src/translate";

const TARGET_LOCALES: TranslateTargetLocale[] = ["en", "fr", "it"];

type CliOptions = {
  slugs: string[];
  locales: TranslateTargetLocale[];
  dryRun: boolean;
  strict: boolean;
};

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

function printUsage(): void {
  console.log(`Usage:
  npm run translate -- --slug=<slug> [--locale=en|fr|it] [--dry-run] [--strict]
  npm run translate -- --all [--locale=en|fr|it] [--dry-run] [--strict]

Options:
  --slug=<slug>     Translate one publishable DE page (repeatable)
  --all             Translate every publishable DE page
  --locale=<loc>    Target locale (en, fr, or it); repeatable; default: all three
  --dry-run         Print prompt + planned path; no API call / no write
  --strict          Exit non-zero if FR/IT glossary terms are missing from output
`);
}

function parseArgs(argv: string[]): CliOptions {
  let all = false;
  const slugs: string[] = [];
  const locales: TranslateTargetLocale[] = [];
  let dryRun = false;
  let strict = false;

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--strict") {
      strict = true;
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
    if (arg.startsWith("--locale=")) {
      const value = arg.slice("--locale=".length).trim();
      if (!isLocale(value) || value === "de") {
        throw new Error(
          `Invalid --locale=${value} (expected en, fr, or it)`,
        );
      }
      locales.push(value);
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (all && slugs.length > 0) {
    throw new Error("Use either --all or --slug, not both");
  }

  if (!all && slugs.length === 0) {
    printUsage();
    throw new Error("Provide --slug=<slug> or --all");
  }

  const resolvedSlugs = all
    ? listPublishableContentSlugs("de")
    : [...new Set(slugs)];

  for (const slug of resolvedSlugs) {
    if (!isPublishableSlug(slug)) {
      throw new Error(`Refusing to translate fixture slug: ${slug}`);
    }
  }

  const resolvedLocales =
    locales.length > 0 ? [...new Set(locales)] : [...TARGET_LOCALES];

  return {
    slugs: resolvedSlugs,
    locales: resolvedLocales,
    dryRun,
    strict,
  };
}

async function translateOne(
  slug: string,
  locale: TranslateTargetLocale,
  options: CliOptions,
): Promise<boolean> {
  const dePage = getContentPage("de", slug);
  const terms = matchGlossaryTerms(
    dePage.frontmatter.title,
    dePage.frontmatter.description,
    dePage.body,
  );
  const prompt = buildTranslationPrompt(dePage, locale, terms);
  const outPath = translationOutputPath(locale, slug);

  console.log(`\n→ ${slug} [${locale}]`);
  console.log(
    `  glossary: ${terms.length === 0 ? "(none)" : terms.map((t) => t.id).join(", ")}`,
  );
  console.log(`  output: ${outPath}`);

  if (options.dryRun) {
    console.log(`  model: ${getTranslateModel()} (dry-run, not called)`);
    console.log("  --- system prompt ---");
    console.log(prompt.system);
    console.log("  --- user prompt (truncated) ---");
    const preview =
      prompt.user.length > 800
        ? `${prompt.user.slice(0, 800)}\n…`
        : prompt.user;
    console.log(preview);
    return true;
  }

  requireAnthropicApiKey();
  console.log(`  model: ${getTranslateModel()}`);

  const raw = await translateWithAnthropic(prompt);
  const parts = parseLlmTranslation(raw);
  const written = writeTranslation(dePage, locale, parts);
  console.log(`  wrote: ${written}`);

  const verify = verifyGlossaryTermsInTranslation(
    locale,
    parts.title,
    parts.description,
    parts.body,
    terms,
  );

  if (verify.missing.length > 0) {
    for (const miss of verify.missing) {
      console.warn(`  glossary warning: ${miss}`);
    }
    if (options.strict) {
      console.error(`  strict: glossary verification failed for ${slug}/${locale}`);
      return false;
    }
  } else if (locale !== "en" && terms.length > 0) {
    console.log(`  glossary check: ok (${verify.checked.length} term forms)`);
  }

  return true;
}

async function main(): Promise<void> {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));

  if (options.slugs.length === 0) {
    throw new Error("No publishable DE slugs found");
  }

  let ok = true;
  for (const slug of options.slugs) {
    for (const locale of options.locales) {
      const success = await translateOne(slug, locale, options);
      if (!success) {
        ok = false;
      }
    }
  }

  if (!ok) {
    process.exit(1);
  }

  console.log(
    options.dryRun
      ? "\nDry-run complete."
      : "\nTranslation pipeline complete.",
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
