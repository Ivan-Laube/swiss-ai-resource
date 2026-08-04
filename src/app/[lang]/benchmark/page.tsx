import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
import {
  buildBenchmarkQuestionViews,
  buildCompanySizeOptions,
  buildSpendMedianLookup,
  getSurvey,
  getSurveyAggregates,
  hasPublishableBenchmarkData,
} from "@/survey";
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
    title: messages.benchmark.metaTitle,
    description: messages.benchmark.metaDescription,
    alternates: {
      canonical: `${siteUrl}/${lang}/benchmark/`,
      languages: buildLanguageAlternates("/benchmark"),
    },
  };
}

function formatGeneratedAt(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function BenchmarkPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const survey = getSurvey();
  const aggregates = getSurveyAggregates();
  const publishable = hasPublishableBenchmarkData(aggregates);
  const questionViews = publishable
    ? buildBenchmarkQuestionViews(survey, aggregates, lang)
    : [];
  const sizeOptions = buildCompanySizeOptions(survey, lang);
  const medianBySize = buildSpendMedianLookup(survey, aggregates, lang);
  const generatedLabel = formatGeneratedAt(aggregates.generated_at, lang);

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.benchmark.backHome}
        </Link>
        <h1>{messages.benchmark.indexTitle}</h1>
        <p className={styles.lead}>{messages.benchmark.indexLead}</p>
        <p className={styles.meta}>
          {messages.benchmark.sampleSize.replace(
            "{n}",
            String(aggregates.n),
          )}
          {generatedLabel
            ? ` · ${messages.benchmark.generatedAt.replace("{date}", generatedLabel)}`
            : null}
        </p>
        <p className={styles.note}>{messages.benchmark.suppressionNote}</p>

        {!publishable || questionViews.length === 0 ? (
          <section className={styles.empty} aria-labelledby="empty-heading">
            <h2 id="empty-heading">{messages.benchmark.emptyTitle}</h2>
            <p>{messages.benchmark.emptyLead}</p>
            <p className={styles.cta}>
              <Link href={`/${lang}/survey/`}>
                {messages.benchmark.surveyCta}
              </Link>
            </p>
          </section>
        ) : (
          <div className={styles.questions}>
            {questionViews.map((question) => {
              const maxCount = Math.max(
                ...question.rows.map((row) => row.count),
                1,
              );
              return (
                <section
                  key={question.questionId}
                  className={styles.card}
                  aria-labelledby={`q-${question.questionId}`}
                >
                  <div className={styles.cardHeader}>
                    <h2 id={`q-${question.questionId}`}>{question.prompt}</h2>
                    <span className={styles.cardN}>
                      {messages.benchmark.questionSample.replace(
                        "{n}",
                        String(question.n),
                      )}
                    </span>
                  </div>
                  <ul className={styles.bars}>
                    {question.rows.map((row) => (
                      <li key={row.optionId}>
                        <div className={styles.barMeta}>
                          <span>{row.label}</span>
                          <span>
                            {row.count} · {row.percent}%
                          </span>
                        </div>
                        <div
                          className={styles.barTrack}
                          role="presentation"
                        >
                          <div
                            className={styles.barFill}
                            style={{
                              width: `${Math.max(
                                (row.count / maxCount) * 100,
                                2,
                              )}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        <BenchmarkComparison
          messages={messages.benchmark}
          sizeOptions={sizeOptions}
          medianBySize={medianBySize}
        />

        <p className={styles.cta}>
          <Link href={`/${lang}/survey/`}>{messages.benchmark.surveyCta}</Link>
        </p>
        <p className={styles.disclaimer}>{messages.benchmark.disclaimer}</p>
      </main>
    </>
  );
}
