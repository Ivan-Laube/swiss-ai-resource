const UMLAUT_MAP: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "ae",
  Ö: "oe",
  Ü: "ue",
  ß: "ss",
};

/**
 * Slugify a heading for stable fragment ids.
 * Expands German umlauts, strips other diacritics, kebab-cases, and
 * dedupes within a document (including against reserved ids).
 */
export function createHeadingSlugger(
  reserved: Iterable<string> = [],
): (text: string) => string {
  const used = new Set<string>(reserved);

  return (text: string): string => {
    let slug = text
      .replace(/[äöüÄÖÜß]/g, (ch) => UMLAUT_MAP[ch] ?? ch)
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      slug = "section";
    }

    let candidate = slug;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${slug}-${n}`;
      n += 1;
    }
    used.add(candidate);
    return candidate;
  };
}
