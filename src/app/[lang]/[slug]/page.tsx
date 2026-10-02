import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Callout,
  Container,
  IconChevronRight,
  IconExternalLink,
  StatusPill,
} from "@/components/ui";
import {
  counselReviewComplete,
  getContentPage,
  isPublishableSlug,
  LEGAL_SLUGS,
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
import { renderMarkdown, type MarkdownHeading } from "@/lib/markdown";
import { readingTimeMinutes } from "@/lib/reading-time";
import { buildPageMetadata } from "@/lib/metadata";
import { pickLocalized, toolsForContentSlug } from "@/rules";
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
    return buildPageMetadata({
      locale: lang,
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      path: slug,
      languages: buildLanguageAlternates(`/${slug}`, localesWithSlug(slug)),
    });
  } catch {
    return {};
  }
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function TocList({ headings }: { headings: MarkdownHeading[] }) {
  const h2s = headings.filter((h) => h.level === 2);
  if (h2s.length === 0) {
    return null;
  }

  return (
    <ol className={styles.tocList}>
      {h2s.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`}>{heading.text}</a>
        </li>
      ))}
    </ol>
  );
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
  const { html, headings } = renderMarkdown(page.body, { locale: page.locale });
  const lastVerified = page.frontmatter.last_verified;
  const minutes = readingTimeMinutes(page.body);
  const isLegal = LEGAL_SLUGS.has(slug);
  const showToc = !isLegal && headings.some((h) => h.level === 2);
  const relatedTools = isLegal ? [] : toolsForContentSlug(slug);
  const showCounsel =
    !isLegal && counselReviewComplete(page.frontmatter);

  const readingLabel = messages.content.readingTime.replace(
    "{minutes}",
    String(minutes),
  );

  return (
    <>
      <SiteHeader
        activeLang={lang}
        nav={messages.nav}
        availableLocales={localesWithSlug(slug)}
      />
      <main
        id="main"
        className={styles.main}
        lang={lang}
        data-slug={slug}
      >
        <Container>
          <nav
            className={styles.breadcrumbs}
            aria-label={messages.content.breadcrumbLabel}
          >
            <ol className={styles.breadcrumbList}>
              <li>
                <Link href={`/${lang}/`}>
                  {messages.content.breadcrumbHome}
                </Link>
              </li>
              {!isLegal ? (
                <li>
                  <IconChevronRight size={14} className={styles.crumbSep} />
                  <Link href={`/${lang}/guides/`}>
                    {messages.guides.indexTitle}
                  </Link>
                </li>
              ) : null}
              <li>
                <IconChevronRight size={14} className={styles.crumbSep} />
                <span aria-current="page">{page.frontmatter.title}</span>
              </li>
            </ol>
          </nav>


          <div
            className={
              showToc ? `${styles.layout} ${styles.layoutWithToc}` : styles.layout
            }
          >
            <div className={styles.content}>
              {/* Title block inside the text column: the lead lines up with
                  the body text and the desktop TOC starts level with the title. */}
              <header className={styles.pageHeader}>
                <h1 className={styles.title}>{page.frontmatter.title}</h1>
                <div className={styles.metaRow}>
                  <p className={styles.meta}>
                    {messages.content.lastVerified}:{" "}
                    <time dateTime={lastVerified}>
                      {formatIsoDate(lastVerified, lang)}
                    </time>
                  </p>
                  <p className={styles.meta}>{readingLabel}</p>
                  {showCounsel ? (
                    <StatusPill tone="info" className={styles.counselBadge}>
                      {messages.content.counselBadge.replace(
                        "{date}",
                        formatIsoDate(page.frontmatter.review_date!, lang),
                      )}
                    </StatusPill>
                  ) : null}
                </div>
              </header>

              {lang !== "de" ? (
                <Callout tone="neutral" className={styles.translationNotes}>
                  <p>{messages.content.translationCanonicalNote}</p>
                  {page.frontmatter.translation_status === "draft" ? (
                    <p>{messages.content.translationDraft}</p>
                  ) : null}
                </Callout>
              ) : null}

              <p className={styles.lead}>{page.frontmatter.description}</p>

              {showToc ? (
                <details className={`${styles.tocMobile} print-hide-toc`}>
                  <summary className={styles.tocSummary}>
                    {messages.content.tocLabel}
                  </summary>
                  <nav aria-label={messages.content.tocNavLabel}>
                    <TocList headings={headings} />
                  </nav>
                </details>
              ) : null}

              <article
                className="prose"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {relatedTools.length > 0 ? (
                <section
                  className={styles.relatedTools}
                  aria-labelledby="related-tools-heading"
                >
                  <h2
                    id="related-tools-heading"
                    className={styles.sectionHeading}
                  >
                    {messages.content.relatedTools}
                  </h2>
                  <ul className={styles.relatedList}>
                    {relatedTools.map((tool) => (
                      <li key={tool.id}>
                        <Link href={`/${lang}/tools/${tool.id}/`}>
                          {pickLocalized(tool.title, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section
                className={styles.sources}
                aria-labelledby="sources-heading"
              >
                <h2 id="sources-heading" className={styles.sectionHeading}>
                  {messages.content.sources}
                </h2>
                <ul className={styles.sourceList}>
                  {page.frontmatter.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sourceLink}
                      >
                        <span className={styles.sourceTitle}>
                          {source.title}
                        </span>
                        <span className={styles.sourceMeta}>
                          {sourceHost(source.url)}
                          <IconExternalLink size={16} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <p className={styles.metaFooter}>
                {messages.content.lastVerified}:{" "}
                <time dateTime={lastVerified}>
                  {formatIsoDate(lastVerified, lang)}
                </time>
              </p>
              <p className={styles.disclaimer}>{messages.content.disclaimer}</p>
            </div>

            {showToc ? (
              <aside className={`${styles.tocDesktop} print-hide-toc`}>
                <nav aria-labelledby="toc-heading">
                  <h2 id="toc-heading" className={styles.tocHeading}>
                    {messages.content.tocLabel}
                  </h2>
                  <TocList headings={headings} />
                </nav>
              </aside>
            ) : null}
          </div>
        </Container>
      </main>
    </>
  );
}
