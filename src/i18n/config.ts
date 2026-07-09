export const locales = ["de", "en", "fr", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const localeLabels: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  fr: "FR",
  it: "IT",
};

/** BCP 47 tags for hreflang link elements. */
export const hrefLangTags: Record<Locale, string> = {
  de: "de-CH",
  en: "en",
  fr: "fr-CH",
  it: "it-CH",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
