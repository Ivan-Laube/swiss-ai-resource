/**
 * Translate downloadable templates (content/templates/<id>/de.md) into
 * EN/FR/IT (T49). Same model and glossary as the guide pipeline; output is
 * structure-checked (headings, table rows, placeholders) before it is written.
 *
 *   npm run translate:templates -- --id=ai-policy-template --dry-run
 *   npm run translate:templates -- --id=ai-policy-template --missing-only
 *   npm run translate:templates -- --all --locale=fr --strict
 *
 * --missing-only translates only locales without a file (first publication:
 * keeps a hand-reviewed EN). Without it, existing translations are replaced,
 * as after a change to the German template.
 */
import fs from "node:fs";
import path from "node:path";

import type { Locale } from "../src/i18n/config";
import { listTemplateIds, readTemplate, templatePath } from "../src/templates/load";
import {
  getTranslateModel,
  matchGlossaryTerms,
  requireAnthropicApiKey,
  translateWithAnthropic,
  verifyGlossaryTermsInTranslation,
  type TranslateTargetLocale,
} from "../src/translate";
import { buildTemplatePrompt, finishTemplateTranslation } from "../src/translate/template";

const TARGETS: TranslateTargetLocale[] = ["en", "fr", "it"];

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
  const ids: string[] = [];
  const targets: TranslateTargetLocale[] = [];
  let all = false;
  let missingOnly = false;
  let dryRun = false;
  let strict = false;
  for (const arg of argv) {
    if (arg.startsWith("--id=")) ids.push(arg.slice(5));
    else if (arg.startsWith("--locale=")) {
      const locale = arg.slice(9) as TranslateTargetLocale;
      if (!TARGETS.includes(locale)) throw new Error(`Unknown target locale: ${locale}`);
      targets.push(locale);
    } else if (arg === "--all") all = true;
    else if (arg === "--missing-only") missingOnly = true;
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--strict") strict = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (all === ids.length > 0) throw new Error("Use either --all or --id=<id>");
  const known = listTemplateIds();
  for (const id of ids) {
    if (!known.includes(id)) throw new Error(`Unknown template: ${id} (known: ${known.join(", ")})`);
  }
  return {
    ids: all ? known : ids,
    targets: targets.length > 0 ? targets : TARGETS,
    missingOnly,
    dryRun,
    strict,
  };
}

async function main(): Promise<void> {
  loadDotEnv();
  const options = parseArgs(process.argv.slice(2));
  let ok = true;

  for (const id of options.ids) {
    const de = readTemplate(id, "de");
    const terms = matchGlossaryTerms("", "", de);

    for (const locale of options.targets) {
      const out = templatePath(id, locale as Locale);
      if (options.missingOnly && fs.existsSync(out)) {
        console.log(`= ${id} [${locale}] exists, skipped (--missing-only)`);
        continue;
      }
      const prompt = buildTemplatePrompt(id, de, locale, terms);
      console.log(`\n→ ${id} [${locale}] → ${path.relative(process.cwd(), out)}`);
      if (options.dryRun) {
        console.log(`  model: ${getTranslateModel()} (dry-run, not called)`);
        console.log(prompt.system);
        continue;
      }

      requireAnthropicApiKey();
      const markdown = finishTemplateTranslation(de, await translateWithAnthropic(prompt));
      fs.writeFileSync(out, markdown);
      console.log("  wrote");

      const glossary = verifyGlossaryTermsInTranslation(locale, "", "", markdown, terms);
      for (const miss of glossary.missing) console.warn(`  glossary warning: ${miss}`);
      if (glossary.missing.length > 0 && options.strict) ok = false;
    }
  }

  if (!ok) process.exit(1);
  console.log(options.dryRun ? "\nDry-run complete." : "\nTemplate translation complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
