import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorTable } from "@/components/VendorTable";
import { Callout, Container } from "@/components/ui";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { getVendors } from "@/vendors";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const messages = getMessages(lang);

  return buildPageMetadata({
    locale: lang,
    title: messages.vendors.indexTitle,
    description: messages.vendors.indexLead,
    path: "vendors",
    languages: buildLanguageAlternates("/vendors"),
  });
}

export default async function VendorsPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const vendors = getVendors();

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/`} className={styles.back}>
            {messages.vendors.backHome}
          </Link>
          <header className={styles.pageHeader}>
            <h1>{messages.vendors.indexTitle}</h1>
            <p className={styles.lead}>{messages.vendors.indexLead}</p>
          </header>

          <VendorTable
            vendors={vendors}
            vendorsMessages={messages.vendors}
            lang={lang}
          />

          <Callout tone="neutral" className={styles.disclaimer}>
            {messages.vendors.disclaimer}
          </Callout>
        </Container>
      </main>
    </>
  );
}
