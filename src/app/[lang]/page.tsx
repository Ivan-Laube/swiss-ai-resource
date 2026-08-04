import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllContentPages, isPublishableSlug } from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
import { getAllRules, pickLocalized } from "@/rules";
import { getVendors } from "@/vendors";
import styles from "./page.module.css";

/** Legal pages are linked from the site footer, not the compliance index. */
const LEGAL_SLUGS = new Set(["impressum", "datenschutz"]);

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const messages = getMessages(lang);

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/`,
      languages: buildLanguageAlternates(),
    },
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const pages = getAllContentPages(lang).filter(
    (page) =>
      isPublishableSlug(page.slug) && !LEGAL_SLUGS.has(page.slug),
  );
  const trees = getAllRules();
  const vendors = getVendors();

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <p className={styles.eyebrow}>{messages.home.eyebrow}</p>
        <h1>{messages.home.title}</h1>
        <p className={styles.lead}>{messages.home.lead}</p>
        <p className={styles.note}>{messages.home.note}</p>

        {pages.length > 0 ? (
          <section
            className={styles.compliance}
            aria-labelledby="compliance-heading"
          >
            <h2 id="compliance-heading">{messages.home.complianceHeading}</h2>
            <ul className={styles.pageList}>
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${lang}/${page.slug}/`}>
                    {page.frontmatter.title}
                  </Link>
                  <p>{page.frontmatter.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {trees.length > 0 ? (
          <section
            className={styles.tools}
            aria-labelledby="tools-heading"
          >
            <h2 id="tools-heading">{messages.home.toolsHeading}</h2>
            <ul className={styles.pageList}>
              {trees.map((tree) => (
                <li key={tree.id}>
                  <Link href={`/${lang}/tools/${tree.id}/`}>
                    {pickLocalized(tree.title, lang)}
                  </Link>
                  <p>{pickLocalized(tree.description, lang)}</p>
                </li>
              ))}
            </ul>
            <p className={styles.toolsIndex}>
              <Link href={`/${lang}/tools/`}>
                {messages.tools.indexTitle}
              </Link>
            </p>
          </section>
        ) : null}

        {vendors.length > 0 ? (
          <section
            className={styles.vendors}
            aria-labelledby="vendors-heading"
          >
            <h2 id="vendors-heading">{messages.home.vendorsHeading}</h2>
            <p className={styles.vendorsLead}>{messages.vendors.indexLead}</p>
            <p className={styles.toolsIndex}>
              <Link href={`/${lang}/vendors/`}>
                {messages.vendors.indexTitle}
              </Link>
            </p>
          </section>
        ) : null}

        <section
          className={styles.websiteCheck}
          aria-labelledby="website-check-heading"
        >
          <h2 id="website-check-heading">
            {messages.home.websiteCheckHeading}
          </h2>
          <p className={styles.vendorsLead}>
            {messages.home.websiteCheckLead}
          </p>
          <p className={styles.toolsIndex}>
            <Link href={`/${lang}/website-check/`}>
              {messages.home.websiteCheckHeading}
            </Link>
          </p>
        </section>

        <section
          className={styles.survey}
          aria-labelledby="survey-heading"
        >
          <h2 id="survey-heading">{messages.home.surveyHeading}</h2>
          <p className={styles.vendorsLead}>{messages.home.surveyLead}</p>
          <p className={styles.toolsIndex}>
            <Link href={`/${lang}/survey/`}>
              {messages.home.surveyHeading}
            </Link>
          </p>
          <p className={styles.toolsIndex}>
            <Link href={`/${lang}/benchmark/`}>
              {messages.home.benchmarkLink}
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
