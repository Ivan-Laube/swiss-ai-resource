import type { Locale } from "@/i18n/config";

/** BCP 47 tags for Intl date formatting (Swiss locales; EN uses en-GB). */
const dateLocaleTags: Record<Locale, string> = {
  de: "de-CH",
  en: "en-GB",
  fr: "fr-CH",
  it: "it-CH",
};

export function localeToBcp47(locale: Locale): string {
  return dateLocaleTags[locale];
}

/**
 * Format a calendar ISO date (`YYYY-MM-DD`) for display.
 * Appends `T00:00:00` so the day does not shift under UTC parsing.
 */
export function formatIsoDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeToBcp47(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}
