import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { buildNotFoundStrings } from "@/components/not-found-strings";
import { buildSiteFooterModel } from "@/components/SiteFooter";
import type { SiteFooterModel } from "@/components/SiteFooterView";
import {
  defaultLocale,
  getMessages,
  locales,
  type Locale,
} from "@/i18n";
import { buildRootMetadata } from "@/lib/metadata";
import { instrumentSans } from "./document";
import "./globals.css";

export const metadata: Metadata = {
  ...buildRootMetadata(defaultLocale),
  title: "404",
};

/** Sets <html lang> from the first path segment when it is a known locale. */
const setDocumentLangScript = `(function(){var s=location.pathname.split("/").filter(Boolean)[0]||"";if(/^(${locales.join("|")})$/.test(s))document.documentElement.lang=s;})();`;

function buildFooterByLocale(): Record<Locale, SiteFooterModel> {
  const record = {} as Record<Locale, SiteFooterModel>;
  for (const lang of locales) {
    record[lang] = buildSiteFooterModel(lang, getMessages(lang));
  }
  return record;
}

export default function GlobalNotFound() {
  const footerByLocale = buildFooterByLocale();

  return (
    <html lang={defaultLocale} className={instrumentSans.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: setDocumentLangScript }} />
        <NotFoundView
          stringsByLocale={buildNotFoundStrings()}
          footerByLocale={footerByLocale}
        />
      </body>
    </html>
  );
}
