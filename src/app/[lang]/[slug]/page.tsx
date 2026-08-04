import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getContentPage,
  isPublishableSlug,
  listPublishableContentSlugs,
  localesWithSlug,
} from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { formatIsoDate } from "@/lib/format-date";
import { renderMarkdown } from "@/lib/markdown";
import { siteUrl } from "@/lib/site";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const slug of listPublishableContentSlugs(lang)) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLocale(lang) || !isPublishableSlug(slug)) {
    return {};
  }

  try {
    const page = getContentPage(lang, slug);
    return {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      alternates: {
        canonical: `${siteUrl}/${lang}/${slug}/`,
        languages: buildLanguageAlternates(`/${slug}`, localesWithSlug(slug)),
      },
    };
  } catch {
    return {};
  }
}

export default async function ContentPage({ params }: PageProps) {
  const { lang, slug } = await params;

  if (!isLocale(lang) || !isPublishableSlug(slug)) {
    notFound();
  }

  let page;
  try {
    page = getContentPage(lang, slug);
  } catch {
    notFound();
  }

  const messages = getMessages(lang);
  const html = renderMarkdown(page.body);
  const lastVerified = page.frontmatter.last_verified;
  const lastVerifiedLabel = (
    <>
      {messages.content.lastVerified}:{" "}
      <time dateTime={lastVerified}>{formatIsoDate(lastVerified, lang)}</time>
    </>
  );

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.content.backHome}
        </Link>
        <h1>{page.frontmatter.title}</h1>
        <p className={styles.meta}>{lastVerifiedLabel}</p>
        {lang !== "de" ? (
          <div className={styles.translationNotes}>
            <p className={styles.translationNote}>
              {messages.content.translationCanonicalNote}
            </p>
            {page.frontmatter.translation_status === "draft" ? (
              <p className={styles.translationNote}>
                {messages.content.translationDraft}
              </p>
            ) : null}
          </div>
        ) : null}
        <p className={styles.lead}>{page.frontmatter.description}</p>
        <article
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <section className={styles.sources} aria-labelledby="sources-heading">
          <h2 id="sources-heading">{messages.content.sources}</h2>
          <ul>
            {page.frontmatter.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <p className={styles.metaFooter}>{lastVerifiedLabel}</p>
        <p className={styles.disclaimer}>{messages.content.disclaimer}</p>
      </main>
    </>
  );
}
