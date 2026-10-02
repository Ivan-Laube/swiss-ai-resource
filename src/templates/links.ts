import type { Locale } from "@/i18n/config";

import { listTemplateIds, templateLocales } from "./load";

/** Link target used in Markdown for a generated download: `download:<template id>`. */
export const DOWNLOAD_LINK_PREFIX = "download:";

/**
 * Site path of a template's Word download in `locale` (T50), falling back
 * to DE while a translation doesn't exist yet. Throws for an unknown id, so
 * a broken `download:` link fails the build instead of shipping a 404.
 */
export function downloadHref(id: string, locale: Locale): string {
  if (!listTemplateIds().includes(id)) {
    throw new Error(
      `Unknown download "${id}" (known: ${listTemplateIds().join(", ") || "none"}; templates live in content/templates/<id>/de.md)`,
    );
  }
  const file = templateLocales(id).includes(locale) ? locale : "de";
  return `/downloads/${id}-${file}.docx`;
}
