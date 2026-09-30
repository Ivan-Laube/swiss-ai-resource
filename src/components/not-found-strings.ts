import { getMessages, locales, type Locale } from "@/i18n";
import type { Messages } from "@/i18n/types";

/** The only strings NotFoundView needs, per locale (keeps catalogues off the client). */
export type NotFoundStrings = {
  nav: Messages["nav"];
  notFound: Messages["notFound"];
};

/** Server-side: build the per-locale strings passed into the client 404 view. */
export function buildNotFoundStrings(): Record<Locale, NotFoundStrings> {
  const record = {} as Record<Locale, NotFoundStrings>;
  for (const lang of locales) {
    const messages = getMessages(lang);
    record[lang] = { nav: messages.nav, notFound: messages.notFound };
  }
  return record;
}
