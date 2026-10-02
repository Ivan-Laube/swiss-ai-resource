"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Callout, StatusPill, type StatusTone } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { benchmarkSelection } from "@/readiness/benchmark";
import { NA, type ReadinessCheck as CheckData } from "@/readiness/schema";
import {
  isVisible,
  missingAnswers,
  scoreReadiness,
  type Answers,
  type NextStep,
} from "@/readiness/score";
import { pickLocalized, type LocalizedString } from "@/rules/schema";

import styles from "./ReadinessCheck.module.css";

export type ProfileField = {
  id: string;
  prompt: LocalizedString;
  options: { id: string; label: LocalizedString }[];
};

type ResolvedLink = { href: string; label: string };

type Props = {
  check: CheckData;
  profile: ProfileField[];
  /** Link string (guide:/tool:/site:/download:) → href and label for this locale. */
  links: Record<string, ResolvedLink>;
  locale: Locale;
  messages: Messages["readiness"];
  /** Absolute site origin, printed after links in the PDF. */
  siteUrl: string;
  /** Survey comparison (T48): shares per question id, empty until n ≥ 5. */
  benchmark: {
    shares: Record<string, number>;
    responses: number;
    surveyHref: string;
    surveyPrompt: string;
    surveyCta: string;
  };
};

type Question = CheckData["questions"][number] | CheckData["security"]["questions"][number];

const SECURITY_TONE: Record<string, StatusTone> = {
  "any-zero": "danger",
  "no-zero-some-one": "warning",
  "all-two": "success",
};

const AREA_TONE: Record<string, StatusTone> = {
  gap: "danger",
  partly: "warning",
  covered: "success",
  not_relevant: "neutral",
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * The AI readiness self-check (T47). Everything it asks and scores comes
 * from data/readiness-check.json via the engine in src/readiness/score.ts;
 * this component only renders. Answers live in memory only: closing or
 * reloading the page clears them (the page says so; the printout is the record).
 */
export function ReadinessCheck({
  check,
  profile,
  links,
  locale,
  messages,
  siteUrl,
  benchmark,
}: Props) {
  const t = (value: LocalizedString) => pickLocalized(value, locale);
  const [profileAnswers, setProfileAnswers] = useState<Answers>({});
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const formStart = useRef<HTMLDivElement>(null);

  const allQuestions: Question[] = useMemo(
    () => [...check.questions, ...check.security.questions],
    [check],
  );
  const missing = missingAnswers(check, answers, profileAnswers);
  const total = profile.length + allQuestions.filter((q) => isVisible(q, answers)).length;
  const answered = total - missing.length;
  const result = useMemo(
    () => (showResult && missing.length === 0 ? scoreReadiness(check, answers, profileAnswers) : null),
    [showResult, missing.length, check, answers, profileAnswers],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration flag for e2e
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (result) {
      resultHeading.current?.focus();
    }
  }, [result]);

  const questionById = (id: string) => allQuestions.find((q) => q.id === id);
  const tierLabel = (id: string) => t(check.tiers.find((tier) => tier.id === id)!.label);
  const tierTone = (id: string): StatusTone => {
    const index = check.tiers.findIndex((tier) => tier.id === id);
    return index === 0 ? "danger" : index === check.tiers.length - 1 ? "success" : "warning";
  };

  function answer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function restart() {
    setAnswers({});
    setProfileAnswers({});
    setShowResult(false);
    setShowAllSteps(false);
    setCompanyName("");
    formStart.current?.scrollIntoView();
  }

  function renderLinks(linkIds: string[]) {
    const resolved = linkIds.flatMap((id) => (links[id] ? [links[id]] : []));
    if (resolved.length === 0) {
      return null;
    }
    return (
      <p className={styles.links}>
        <span className={styles.linksLabel}>{messages.readMore}</span>{" "}
        {resolved.map((link, i) => (
          <span key={link.href}>
            {i > 0 ? " · " : null}
            <a href={link.href} data-print-url={`${siteUrl}${link.href}`}>
              {link.label}
            </a>
          </span>
        ))}
      </p>
    );
  }

  function renderQuestion(q: Question) {
    if (!isVisible(q, answers)) {
      return null;
    }
    const options = [...q.options, ...(q.na_option ? [q.na_option] : [])];
    return (
      <fieldset key={q.id} className={styles.question}>
        <legend className={styles.prompt}>{t(q.prompt)}</legend>
        {q.help ? <p className={styles.help}>{t(q.help)}</p> : null}
        <div className={styles.options}>
          {options.map((o) => (
            <label key={o.id} className={styles.option}>
              <input
                type="radio"
                name={q.id}
                value={o.id}
                checked={answers[q.id] === o.id}
                onChange={() => answer(q.id, o.id)}
              />
              <span>{t(o.label)}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  function renderStep(step: NextStep, extraClass = "") {
    const q = questionById(step.id);
    if (!q) {
      return null;
    }
    return (
      <li key={`${step.kind}:${step.id}`} className={`${styles.step} ${extraClass}`}>
        {step.kind === "security" ? (
          <StatusPill tone="info" className={styles.stepTag}>
            {t(check.security.tag)}
          </StatusPill>
        ) : null}
        <p className={styles.stepAction}>{t(q.action)}</p>
        {renderLinks([...q.links, ...(result?.extraLinks ?? [])])}
      </li>
    );
  }

  const notes = check.profile.flatMap((p) =>
    p.notes.filter((n) => n.when.includes(profileAnswers[p.id] ?? "")).map((n) => t(n.text)),
  );

  return (
    <div className={styles.root} data-hydrated={hydrated ? "true" : "false"}>
      {check.status !== "live" ? (
        <Callout tone="warning" className={`${styles.callout} readiness-print-hide`}>
          <p>{messages.draftNotice}</p>
        </Callout>
      ) : null}

      <Callout tone="info" className={`${styles.callout} readiness-print-hide`}>
        <p>{t(check.session_note)}</p>
      </Callout>

      {!result ? (
        <div ref={formStart} className={styles.form}>
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>{messages.profileTitle}</legend>
            {profile.map((p) => (
              <fieldset key={p.id} className={styles.question}>
                <legend className={styles.prompt}>{t(p.prompt)}</legend>
                <div className={styles.options}>
                  {p.options.map((o) => (
                    <label key={o.id} className={styles.option}>
                      <input
                        type="radio"
                        name={`profile-${p.id}`}
                        value={o.id}
                        checked={profileAnswers[p.id] === o.id}
                        onChange={() => setProfileAnswers((prev) => ({ ...prev, [p.id]: o.id }))}
                      />
                      <span>{t(o.label)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            {notes.map((note) => (
              <Callout key={note} tone="neutral" className={styles.callout}>
                <p>{note}</p>
              </Callout>
            ))}
          </fieldset>

          {check.dimensions.map((d) => (
            <fieldset key={d.id} className={styles.section}>
              <legend className={styles.sectionTitle}>{t(d.title)}</legend>
              {check.questions.filter((q) => q.dimension === d.id).map(renderQuestion)}
            </fieldset>
          ))}

          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>{t(check.security.title)}</legend>
            <p className={styles.help}>{t(check.security.intro)}</p>
            {check.security.questions.map(renderQuestion)}
          </fieldset>

          <div className={styles.submit} aria-live="polite">
            <p className={styles.progress}>{fill(messages.progress, { answered, total })}</p>
            {missing.length > 0 ? (
              <p className={styles.help}>{fill(messages.incomplete, { n: missing.length })}</p>
            ) : null}
            <Button
              type="button"
              disabled={missing.length > 0}
              onClick={() => setShowResult(true)}
            >
              {messages.showResult}
            </Button>
          </div>
        </div>
      ) : (
        <section className={styles.result} aria-labelledby="readiness-result">
          <label className={`${styles.companyField} readiness-print-hide`}>
            <span>{messages.companyNameLabel}</span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />
          </label>
          {companyName ? <p className={styles.printCompany}>{companyName}</p> : null}

          <h2 id="readiness-result" ref={resultHeading} tabIndex={-1} className={styles.resultTitle}>
            {messages.resultTitle}
          </h2>

          <div className={styles.scoreRow}>
            <p className={styles.score}>
              <span className={styles.scoreLabel}>{messages.scoreLabel}</span>
              <span className={styles.scoreValue}>{result.score}</span>
              <span className={styles.scoreMax}>/ 100</span>
            </p>
            <p className={styles.level}>
              <span className={styles.scoreLabel}>{messages.levelLabel}</span>
              <StatusPill tone={tierTone(result.tier)}>{tierLabel(result.tier)}</StatusPill>
            </p>
          </div>
          <p>{t(check.tiers.find((tier) => tier.id === result.tier)!.summary)}</p>

          {result.redFlags.length > 0
            ? (() => {
                const topics = result.redFlags.map((id) => {
                  const q = check.questions.find((x) => x.id === id);
                  return q?.red_flag ? t(q.red_flag.topic) : id;
                });
                const joined =
                  topics.length > 1
                    ? `${topics.slice(0, -1).join(", ")} ${t(check.red_flags.and)} ${topics[topics.length - 1]}`
                    : topics[0];
                const text = result.lowered
                  ? fill(t(check.red_flags.lowered), {
                      score: result.score,
                      tier: tierLabel(result.scoreTier),
                      capped_tier: tierLabel(result.tier),
                      topics: joined,
                    })
                  : fill(t(check.red_flags.banner), { topics: joined });
                return (
                  <Callout tone="warning" className={styles.callout}>
                    <p>{text}</p>
                  </Callout>
                );
              })()
            : null}

          {result.profileNotes.map((id) => {
            const note = check.profile.find((p) => p.id === id)?.add_links?.note;
            return note ? (
              <Callout key={id} tone="info" className={styles.callout}>
                <p>{t(note)}</p>
              </Callout>
            ) : null;
          })}

          <h3 className={styles.subTitle}>{messages.nextStepsTitle}</h3>
          {result.nextSteps.length === 0 ? (
            <p>{messages.noSteps}</p>
          ) : (
            <>
              <ol className={styles.steps}>
                {result.nextSteps.map((step, i) =>
                  // Collapsed on screen; the printout always lists every step.
                  renderStep(step, !showAllSteps && i >= result.top.length ? styles.printOnly : ""),
                )}
              </ol>
              {result.nextSteps.length > result.top.length ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="readiness-print-hide"
                  onClick={() => setShowAllSteps((v) => !v)}
                >
                  {showAllSteps
                    ? messages.showFewerSteps
                    : fill(messages.showAllSteps, { n: result.nextSteps.length })}
                </Button>
              ) : null}
            </>
          )}

          {(() => {
            const ids = benchmarkSelection(
              benchmark.shares,
              result.nextSteps.filter((s) => s.kind === "question").map((s) => s.id),
              check.questions.map((q) => q.id),
            );
            return (
              <section className={styles.benchmark} aria-labelledby="readiness-benchmark">
                {ids.length > 0 ? (
                  <>
                    <h3 id="readiness-benchmark" className={styles.subTitle}>
                      {messages.benchmarkTitle}
                    </h3>
                    <ul className={styles.benchmarkList}>
                      {ids.map((id) => {
                        const q = check.questions.find((x) => x.id === id)!;
                        return (
                          <li key={id}>
                            {fill(t(q.survey_benchmark!.statement), { pct: benchmark.shares[id] })}
                          </li>
                        );
                      })}
                    </ul>
                    <p className={styles.help}>
                      {fill(messages.benchmarkSource, { n: benchmark.responses })}
                    </p>
                  </>
                ) : null}
                <p className={`${styles.surveyInvite} readiness-print-hide`}>
                  {benchmark.surveyPrompt}{" "}
                  <a href={benchmark.surveyHref}>{benchmark.surveyCta}</a>
                </p>
              </section>
            );
          })()}

          <h3 className={styles.subTitle}>{messages.dimensionsTitle}</h3>
          <ul className={styles.dimensions}>
            {result.dimensions.map((d) => {
              const dim = check.dimensions.find((x) => x.id === d.id)!;
              return (
                <li key={d.id} className={styles.dimension}>
                  <span className={styles.dimensionLabel}>{t(dim.title)}</span>
                  {d.score === null ? (
                    <span className={styles.dimensionNa}>{messages.notApplicable}</span>
                  ) : (
                    <span className={styles.bar} aria-label={`${d.score} / 100`}>
                      <span className={styles.barFill} style={{ width: `${d.score}%` }} />
                      <span className={styles.barValue}>{d.score}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <section className={styles.security} aria-labelledby="readiness-security">
            <h3 id="readiness-security" className={styles.subTitle}>
              {t(check.security.title)}
            </h3>
            <p className={styles.help}>{t(check.security.intro)}</p>
            {(() => {
              const level = check.security.levels.find((l) => l.id === result.security.level)!;
              return (
                <>
                  <p className={styles.level}>
                    <span className={styles.scoreLabel}>{messages.securityLevelLabel}</span>
                    <StatusPill tone={SECURITY_TONE[level.rule]}>{t(level.label)}</StatusPill>
                  </p>
                  <p>{t(level.summary)}</p>
                </>
              );
            })()}
            <ul className={styles.areas}>
              {result.security.areas.map((area) => {
                const q = check.security.questions.find((x) => x.id === area.id)!;
                return (
                  <li key={area.id} className={styles.area}>
                    <span>{t(q.area)}</span>
                    <StatusPill tone={AREA_TONE[area.status]}>
                      {t(check.security.statuses[area.status])}
                    </StatusPill>
                  </li>
                );
              })}
            </ul>
            {result.security.noneCanAct ? <p>{t(check.security.none_can_act.text)}</p> : null}
            {result.security.steps.length > 0 ? (
              <>
                <h4 className={styles.minorTitle}>{messages.securityStepsTitle}</h4>
                <ol className={styles.steps}>
                  {result.security.steps.map((id) =>
                    renderStep({ kind: "question", id, redFlag: false, priority: 0 }),
                  )}
                </ol>
              </>
            ) : null}
            <Callout tone="neutral" className={styles.callout}>
              <p>{t(check.security.not_covered)}</p>
            </Callout>
          </section>

          <div className={`${styles.actions} readiness-print-hide`}>
            <Button type="button" onClick={() => window.print()}>
              {messages.print}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowResult(false)}>
              {messages.editAnswers}
            </Button>
            <Button type="button" variant="ghost" onClick={restart}>
              {messages.restart}
            </Button>
          </div>

          <section className={styles.printOnly} aria-hidden="true">
            <h3 className={styles.subTitle}>{messages.answersTitle}</h3>
            <dl className={styles.recap}>
              {profile.map((p) => (
                <div key={p.id}>
                  <dt>{t(p.prompt)}</dt>
                  <dd>{t(p.options.find((o) => o.id === profileAnswers[p.id])?.label ?? { de: "–" })}</dd>
                </div>
              ))}
              {allQuestions
                .filter((q) => isVisible(q, answers))
                .map((q) => {
                  const chosen =
                    answers[q.id] === NA
                      ? q.na_option?.label
                      : q.options.find((o) => o.id === answers[q.id])?.label;
                  return (
                    <div key={q.id}>
                      <dt>{t(q.prompt)}</dt>
                      <dd>{chosen ? t(chosen) : "–"}</dd>
                    </div>
                  );
                })}
            </dl>
            <p className={styles.printFooter}>
              {fill(messages.printFooter, {
                version: check.version,
                date: new Date().toLocaleDateString(locale === "de" ? "de-CH" : `${locale}-CH`),
              })}
            </p>
          </section>
        </section>
      )}

      <Callout tone="neutral" className={styles.callout}>
        <p>{t(check.disclaimer)}</p>
      </Callout>
    </div>
  );
}
