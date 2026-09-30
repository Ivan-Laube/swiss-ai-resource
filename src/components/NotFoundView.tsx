"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { SiteHeader } from "@/components/SiteHeader";
import {
  SiteFooterView,
  type SiteFooterModel,
} from "@/components/SiteFooterView";
import { SkipLink } from "@/components/SkipLink";
import { Container } from "@/components/ui";
import type { NotFoundStrings } from "@/components/not-found-strings";
import styles from "./NotFoundView.module.css";

type NotFoundViewProps = {
  /** Per-locale strings from buildNotFoundStrings() (server). */
  stringsByLocale: Record<Locale, NotFoundStrings>;
  /** When true, omit the outer shell (parent layout already provides it). */
  nested?: boolean;
  /** Precomputed footer models per locale (required for the global 404 shell). */
  footerByLocale?: Record<Locale, SiteFooterModel>;
};

export function NotFoundView({
  stringsByLocale,
  nested = false,
  footerByLocale,
}: NotFoundViewProps) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const lang = isLocale(segment) ? segment : defaultLocale;
  const messages = stringsByLocale[lang];
  const footerModel = footerByLocale?.[lang];

  const content = (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main}>
        <Container className={styles.body}>
          <h1>{messages.notFound.title}</h1>
          <p>{messages.notFound.message}</p>
          <p>
            <Link href={`/${lang}/`}>{messages.notFound.homeLink}</Link>
          </p>
        </Container>
      </main>
    </>
  );

  if (nested) {
    return content;
  }

  return (
    <div lang={lang} className="localeShell">
      <SkipLink label={messages.nav.skipToContent} />
      {content}
      {footerModel ? <SiteFooterView model={footerModel} /> : null}
    </div>
  );
}
