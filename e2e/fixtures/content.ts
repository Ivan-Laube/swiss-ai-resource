import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

/**
 * Frontmatter title of a guide page, read from content/ so assertions follow
 * translation regenerations instead of hard-coding the current wording.
 */
export function guideTitle(locale: string, slug: string): string {
  const file = path.join(process.cwd(), "content", locale, `${slug}.md`);
  const { data } = matter(fs.readFileSync(file, "utf8"));
  if (typeof data.title !== "string" || !data.title) {
    throw new Error(`No title in ${file}`);
  }
  return data.title;
}
