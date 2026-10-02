/**
 * Generate downloadable Word files from the Markdown templates (T50).
 * Runs in `prebuild`; output goes to public/downloads/ (gitignored) so the
 * static export copies it to out/. Fails the build if a template can't be
 * converted, so a broken template never ships as a missing or empty file.
 *
 *   npm run build:downloads
 */
import fs from "node:fs";
import path from "node:path";

import { markdownToDocx } from "../src/templates/docx";
import { listTemplateIds, readTemplate, templateLocales } from "../src/templates/load";

const OUT_DIR = path.join(process.cwd(), "public", "downloads");

/** First `# ` heading, without Markdown emphasis. */
function titleOf(markdown: string, fallback: string): string {
  const match = /^# (.+)$/m.exec(markdown);
  return match ? match[1].replace(/[*_`]/g, "").trim() : fallback;
}

async function main(): Promise<void> {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const id of listTemplateIds()) {
    for (const locale of templateLocales(id)) {
      const markdown = readTemplate(id, locale);
      const title = titleOf(markdown, id);
      const file = path.join(OUT_DIR, `${id}-${locale}.docx`);
      try {
        fs.writeFileSync(file, await markdownToDocx(markdown, { title, footer: `aicompliant.ch · ${title}` }));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`content/templates/${id}/${locale}.md: ${message}`);
      }
      console.log(`downloads/${id}-${locale}.docx`);
      count += 1;
    }
  }
  console.log(`${count} download${count === 1 ? "" : "s"} generated.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
