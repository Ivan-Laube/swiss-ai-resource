/**
 * Copy the DE heading anchors ({#id}) into the EN/FR/IT pages by heading
 * position, without re-translating. Use after adding or renaming anchors in
 * `content/de/` (marker-only edits don't trigger the translate workflow).
 *
 *   npm run sync:anchors                 # all slugs
 *   npm run sync:anchors -- --slug=ndsg-ai-basics
 *
 * Only heading lines change; frontmatter and prose are left as they are.
 * Fails for a page whose h2/h3 structure differs from DE — re-translate it.
 */
import fs from "node:fs";

import {
  getContentPage,
  listPublishableContentSlugs,
} from "../src/content/load";
import { locales } from "../src/i18n/config";
import { restoreHeadingAnchors } from "../src/translate/anchors";

const slugArg = process.argv.find((arg) => arg.startsWith("--slug="));
const slugs = slugArg
  ? [slugArg.slice("--slug=".length)]
  : listPublishableContentSlugs("de");

/** Split a content file into its frontmatter block and the Markdown after it. */
function splitFrontmatter(raw: string): { head: string; body: string } {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(raw);
  if (!match) {
    throw new Error("missing frontmatter");
  }
  return { head: match[0], body: raw.slice(match[0].length) };
}

let changed = 0;
let failed = false;

for (const slug of slugs) {
  const deBody = getContentPage("de", slug).body;

  for (const locale of locales) {
    if (locale === "de" || !listPublishableContentSlugs(locale).includes(slug)) {
      continue;
    }
    const page = getContentPage(locale, slug);
    const raw = fs.readFileSync(page.path, "utf8");
    try {
      const { head, body } = splitFrontmatter(raw);
      const result = restoreHeadingAnchors(deBody, body);
      if (result.body === body) {
        continue;
      }
      fs.writeFileSync(page.path, head + result.body);
      changed += 1;
      console.log(
        `content/${locale}/${slug}.md: ${result.restored.length > 0 ? `{#${result.restored.join("}, {#")}}` : "removed stale markers"}`,
      );
    } catch (error) {
      failed = true;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`content/${locale}/${slug}.md: ${message}`);
    }
  }
}

console.log(`${changed} translated page${changed === 1 ? "" : "s"} updated.`);
if (failed) {
  process.exit(1);
}
