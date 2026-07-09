import { siteUrl } from "@/lib/site";
import {
  defaultLocale,
  hrefLangTags,
  isLocale,
  localeLabels,
  type Locale,
  locales,
} from "./config";
import { de } from "./messages/de";
import { en } from "./messages/en";
import { fr } from "./messages/fr";
import { it } from "./messages/it";
import type { Messages } from "./types";

const messagesByLocale: Record<Locale, Messages> = {
  de,
  en,
  fr,
  it,
};

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}

export function getLocaleOrDefault(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[hrefLangTags[locale]] = `${siteUrl}/${locale}${normalizedPath}/`;
  }

  languages["x-default"] = `${siteUrl}/${defaultLocale}${normalizedPath}/`;

  return languages;
}

export {
  defaultLocale,
  hrefLangTags,
  isLocale,
  localeLabels,
  locales,
  type Locale,
  type Messages,
};
