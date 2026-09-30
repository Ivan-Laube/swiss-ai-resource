import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, Container } from "@/components/ui";
import { listGuidePages } from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { formatIsoDate } from "@/lib/format-date";
import { siteUrl } from "@/lib/site";
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

  return {
    title: messages.guides.indexTitle,
    description: messages.guides.indexLead,
    alternates: {
      canonical: `${siteUrl}/${lang}/guides/`,
      languages: buildLanguageAlternates("/guides"),
    },
  };
}

export default async function GuidesIndexPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const pages = listGuidePages(lang);

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/`} className={styles.back}>
            {messages.guides.backHome}
          </Link>
          <h1 className={styles.title}>{messages.guides.indexTitle}</h1>
          <p className={styles.lead}>{messages.guides.indexLead}</p>

          {pages.length > 0 ? (
            <ul className={styles.grid}>
              {pages.map((page) => {
                const lastVerified = page.frontmatter.last_verified;
                return (
                  <li key={page.slug} className={styles.gridItem}>
                    <Card
                      href={`/${lang}/${page.slug}/`}
                      className={styles.card}
                    >
                      <h2 className={styles.cardTitle}>
                        {page.frontmatter.title}
                      </h2>
                      <p className={styles.cardDescription}>
                        {page.frontmatter.description}
                      </p>
                      <p className={styles.cardMeta}>
                        {messages.content.lastVerified}:{" "}
                        <time dateTime={lastVerified}>
                          {formatIsoDate(lastVerified, lang)}
                        </time>
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </Container>
      </main>
    </>
  );
}
