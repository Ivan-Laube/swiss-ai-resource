/**
 * Compare explicit heading anchors ({#id}) of every EN/FR/IT page with its
 * German source. Translations are regenerated only after a DE change merges,
 * so a mismatch on a PR is usually just lag: by default this prints warnings.
 * `--strict` (used by the translate workflow after regeneration) fails.
 */
import { getContentPage, listPublishableContentSlugs } from "../src/content/load";
import { locales } from "../src/i18n/config";
import { diffHeadingAnchors, listHeadingAnchors } from "../src/lib/heading-anchors";

const strict = process.argv.includes("--strict");

const problems: string[] = [];
let compared = 0;

for (const slug of listPublishableContentSlugs("de")) {
  const deAnchors = listHeadingAnchors(getContentPage("de", slug).body).map(
    (a) => a.anchor,
  );

  for (const locale of locales) {
    if (locale === "de" || !listPublishableContentSlugs(locale).includes(slug)) {
      continue;
    }
    const anchors = listHeadingAnchors(getContentPage(locale, slug).body).map(
      (a) => a.anchor,
    );
    const { missing, extra } = diffHeadingAnchors(deAnchors, anchors);
    compared += 1;
    if (missing.length > 0) {
      problems.push(`content/${locale}/${slug}.md is missing {#${missing.join("}, {#")}}`);
    }
    if (extra.length > 0) {
      problems.push(`content/${locale}/${slug}.md has anchors not in DE: {#${extra.join("}, {#")}}`);
    }
  }
}

if (problems.length === 0) {
  console.log(`Heading anchors match DE (${compared} translated pages).`);
  process.exit(0);
}

for (const problem of problems) {
  console[strict ? "error" : "warn"](`${strict ? "error" : "warning"}: ${problem}`);
}

if (strict) {
  console.error(
    "Translations must carry exactly the DE heading anchors. Re-run `npm run translate -- --slug=<slug>` or fix the markers by hand.",
  );
  process.exit(1);
}

console.warn(
  "Translations lag DE until the translate workflow runs after merge; it checks this strictly.",
);
