import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuickCheckPanel } from "@/components/home/QuickCheckPanel";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Button,
  Callout,
  Card,
  Container,
  SectionHeader,
} from "@/components/ui";
import {
  listGuidePages,
  type GuideCategory,
} from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  type Messages,
} from "@/i18n";
import { formatIsoDate } from "@/lib/format-date";
import { getLastSourceCheckDate } from "@/lib/last-source-check";
import { buildPageMetadata } from "@/lib/metadata";
import { readingTimeMinutes } from "@/lib/reading-time";
import { siteName } from "@/lib/site";
import {
  getAllRules,
  longestQuestionCount,
  pickLocalized,
} from "@/rules";
import { getScannerChecks } from "@/scanner";
import {
  getSurveyAggregates,
  hasPublishableBenchmarkData,
  SURVEY_SUPPRESSION_THRESHOLD,
} from "@/survey";
import { getVendors } from "@/vendors";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string }>;
};

function categoryLabel(
  category: GuideCategory | undefined,
  home: Messages["home"],
): string | null {
  switch (category) {
    case "datenschutz":
      return home.categoryDatenschutz;
    case "eu-ai-act":
      return home.categoryEuAiAct;
    case "finanzmarkt":
      return home.categoryFinanzmarkt;
    case "beschaffung":
      return home.categoryBeschaffung;
    case "sicherheit":
      return home.categorySicherheit;
    default:
      return null;
  }
}

/** Informational note about the scan's limits, not a check of the site. */
const SCANNER_META_CHECK_ID = "static-scan-honesty-flag";

function withCount(template: string, n: number): string {
  return template.replace("{n}", String(n));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const messages = getMessages(lang);

  const headline = messages.home.title.replace(/\.\s*$/, "");
  const metadata = buildPageMetadata({
    locale: lang,
    title: headline,
    description: messages.meta.description,
    path: "",
    languages: buildLanguageAlternates(),
  });

  // Descriptive <title> for search, not just the brand. The layout's
  // "%s | aicompliant.ch" template only applies to child segments, and this
  // page shares the [lang] segment with that layout, so set it explicitly.
  return { ...metadata, title: { absolute: `${headline} | ${siteName}` } };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const home = messages.home;
  const pages = listGuidePages(lang);
  const trees = getAllRules();
  const vendors = getVendors();
  const lastSourceIso = getLastSourceCheckDate();
  // "What gets checked": real checks only, not the scanner's note about its
  // own limits (static-scan-honesty-flag).
  const scannerChecks = getScannerChecks()
    .checks.filter((check) => check.id !== SCANNER_META_CHECK_ID)
    .map((check) => ({
      id: check.id,
      title: pickLocalized(check.title, lang),
    }));
  const benchmarkPublished = hasPublishableBenchmarkData(getSurveyAggregates());
  const swissHostingCount = vendors.filter(
    (vendor) => vendor.swiss_hosting.value === true,
  ).length;
  const dpaCount = vendors.filter(
    (vendor) => vendor.dpa_url.value !== null,
  ).length;

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <section className={styles.section} aria-labelledby="home-hero-title">
            <div className={styles.hero}>
              <div className={styles.heroCopy}>
                <p className="kicker">{home.eyebrow}</p>
                <h1 id="home-hero-title" className={styles.heroTitle}>
                  {home.title}
                </h1>
                <p className={styles.heroLead}>{home.lead}</p>
                {lang !== "de" ? (
                  <Callout tone="info" className={styles.heroNote}>
                    {home.note}
                  </Callout>
                ) : null}
                <div className={styles.heroActions}>
                  <Button href={`/${lang}/tools/`} variant="primary">
                    {home.ctaTools}
                  </Button>
                  <Button href={`/${lang}/vendors/`} variant="secondary">
                    {home.ctaVendors}
                  </Button>
                </div>
              </div>
              <QuickCheckPanel
                locale={lang}
                strings={{
                  title: home.quickCheckTitle,
                  lead: home.quickCheckLead,
                  urlLabel: home.quickCheckUrlLabel,
                  submit: home.quickCheckSubmit,
                  checksHeading: home.quickCheckChecksHeading,
                  privacy: home.quickCheckPrivacy,
                  urlPlaceholder: messages.websiteCheck.urlPlaceholder,
                  errorBadUrl: messages.websiteCheck.errorBadUrl,
                }}
                checks={scannerChecks}
              />
            </div>
          </section>

          <section
            className={styles.section}
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className={styles.visuallyHidden}>
              {home.statsHeading}
            </h2>
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>{home.statsGuides}</dt>
                <dd className={styles.statValue} data-visual-mask>
                  {pages.length}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>{home.statsTools}</dt>
                <dd className={styles.statValue} data-visual-mask>
                  {trees.length}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>{home.statsVendors}</dt>
                <dd className={styles.statValue} data-visual-mask>
                  {vendors.length}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>{home.statsLastSource}</dt>
                <dd className={styles.statValue}>
                  {lastSourceIso ? (
                    <time dateTime={lastSourceIso} data-visual-mask>
                      {formatIsoDate(lastSourceIso, lang)}
                    </time>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {pages.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="guides-heading"
            >
              <SectionHeader
                title={<span id="guides-heading">{home.guidesHeading}</span>}
                lead={home.guidesLead}
                action={{
                  href: `/${lang}/guides/`,
                  label: home.guidesAction,
                }}
              />
              <ul className={`${styles.cardGrid} ${styles.guides}`}>
                {pages.map((page) => {
                  const lastVerified = page.frontmatter.last_verified;
                  const minutes = readingTimeMinutes(page.body);
                  const category = categoryLabel(
                    page.frontmatter.category,
                    home,
                  );
                  return (
                    <li key={page.slug}>
                      <Card
                        href={`/${lang}/${page.slug}/`}
                        className={styles.card}
                      >
                        {category ? (
                          <p className={`kicker ${styles.cardKicker}`}>
                            {category}
                          </p>
                        ) : null}
                        <h3 className={styles.cardTitle}>
                          {page.frontmatter.title}
                        </h3>
                        <p className={styles.cardDescription}>
                          {page.frontmatter.description}
                        </p>
                        <div className={styles.cardMetaRow}>
                          <p className={styles.cardMeta}>
                            {messages.content.lastVerified}:{" "}
                            <time dateTime={lastVerified}>
                              {formatIsoDate(lastVerified, lang)}
                            </time>
                          </p>
                          <p className={styles.cardMeta} data-visual-mask>
                            {withCount(home.readingTime, minutes)}
                          </p>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {trees.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="tools-heading"
            >
              <SectionHeader
                title={<span id="tools-heading">{home.toolsHeading}</span>}
                lead={home.toolsLead}
                action={{
                  href: `/${lang}/tools/`,
                  label: home.toolsAction,
                }}
              />
              <ul className={styles.cardGrid}>
                {trees.map((tree) => {
                  const maxQuestions = longestQuestionCount(tree, tree.start);
                  return (
                    <li key={tree.id}>
                      <Card
                        href={`/${lang}/tools/${tree.id}/`}
                        className={styles.card}
                      >
                        <h3 className={styles.cardTitle}>
                          {pickLocalized(tree.title, lang)}
                        </h3>
                        <p className={styles.cardDescription}>
                          {pickLocalized(tree.description, lang)}
                        </p>
                        <p className={styles.cardMeta} data-visual-mask>
                          {withCount(home.toolsMaxQuestions, maxQuestions)}
                        </p>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {vendors.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="vendors-heading"
            >
              <SectionHeader
                title={<span id="vendors-heading">{home.vendorsHeading}</span>}
                lead={home.vendorsLead}
              />
              <ul className={styles.vendorCounts}>
                <li className={styles.vendorCount} data-visual-mask>
                  {withCount(home.vendorsListed, vendors.length)}
                </li>
                <li className={styles.vendorCount} data-visual-mask>
                  {withCount(home.vendorsSwissHosting, swissHostingCount)}
                </li>
                <li className={styles.vendorCount} data-visual-mask>
                  {withCount(home.vendorsDpa, dpaCount)}
                </li>
              </ul>
              <p className={styles.vendorNote}>{home.vendorsUnverifiedNote}</p>
              <Button href={`/${lang}/vendors/`} variant="secondary">
                {home.vendorsAction}
              </Button>
            </section>
          ) : null}

          <section
            className={styles.section}
            aria-labelledby="survey-heading"
          >
            <div className={styles.surveyBand}>
              <div className={styles.surveyCopy}>
                <SectionHeader
                  title={
                    <span id="survey-heading">{home.surveyHeading}</span>
                  }
                  lead={home.surveyLead}
                />
              </div>
              <div className={styles.surveyActions}>
                <Button href={`/${lang}/survey/`} variant="primary">
                  {home.surveyCta}
                </Button>
                <Button href={`/${lang}/benchmark/`} variant="secondary">
                  {benchmarkPublished
                    ? home.benchmarkLink
                    : withCount(
                        home.benchmarkPending,
                        SURVEY_SUPPRESSION_THRESHOLD,
                      )}
                </Button>
              </div>
            </div>
          </section>

          <section
            className={styles.section}
            aria-labelledby="methodology-heading"
          >
            <SectionHeader
              title={
                <span id="methodology-heading">{home.methodologyHeading}</span>
              }
            />
            <ul className={styles.methodGrid}>
              <li>
                <Card className={styles.methodCard}>
                  <h3 className={styles.methodTitle}>
                    {home.methodologySourcesTitle}
                  </h3>
                  <p className={styles.methodBody}>
                    {home.methodologySourcesBody}
                  </p>
                </Card>
              </li>
              <li>
                <Card className={styles.methodCard}>
                  <h3 className={styles.methodTitle}>
                    {home.methodologyChecksTitle}
                  </h3>
                  <p className={styles.methodBody}>
                    {home.methodologyChecksBody}
                  </p>
                </Card>
              </li>
              <li>
                <Card className={styles.methodCard}>
                  <h3 className={styles.methodTitle}>
                    {home.methodologyIndependenceTitle}
                  </h3>
                  <p className={styles.methodBody}>
                    {home.methodologyIndependenceBody}
                  </p>
                </Card>
              </li>
            </ul>
          </section>
        </Container>
      </main>
    </>
  );
}
