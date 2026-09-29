"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Messages } from "@/i18n/types";
import type { Locale } from "@/i18n";
import {
  loadTurnstileScript,
  TURNSTILE_ACTION_SURVEY,
} from "@/lib/turnstile-client";
import {
  exclusiveOptionId,
  validateAnswers,
  type AnswerValue,
} from "@/survey/answers";
import {
  pickLocalized,
  type Survey,
  type SurveyChoiceQuestion,
  type SurveyOption,
  type SurveyQuestion,
} from "@/survey/schema";
import styles from "./SurveyForm.module.css";

type SurveyMessages = Messages["survey"];

type SurveyFormProps = {
  survey: Survey;
  locale: Locale;
  messages: SurveyMessages;
};

const PINNED_LAST = new Set(["other", "none", "none-yet"]);

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = items[i]!;
    items[i] = items[j]!;
    items[j] = tmp;
  }
  return items;
}

/** Shuffle nominal options; pin other/none/none-yet last in instrument order. */
function orderOptions(question: SurveyChoiceQuestion): SurveyOption[] {
  if (!question.shuffle_options) {
    return question.options;
  }
  const movable = question.options.filter((o) => !PINNED_LAST.has(o.id));
  const pinned = question.options.filter((o) => PINNED_LAST.has(o.id));
  return [...shuffleInPlace([...movable]), ...pinned];
}

export function SurveyForm({ survey, locale, messages }: SurveyFormProps) {
  const formId = useId();
  const apiUrl = (process.env.NEXT_PUBLIC_SURVEY_API_URL ?? "").replace(
    /\/$/,
    "",
  );
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const intakeReady = apiUrl.length > 0 && siteKey.length > 0;

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [email, setEmail] = useState("");
  const [reportOptIn, setReportOptIn] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [optInOnSuccess, setOptInOnSuccess] = useState(false);
  // Instrument order on SSR/first paint; shuffle after mount to avoid hydration mismatch.
  const [orderedOptionsByQuestion, setOrderedOptionsByQuestion] = useState(
    () => {
      const map = new Map<string, SurveyOption[]>();
      for (const question of survey.questions) {
        if (question.input === "text") continue;
        map.set(question.id, question.options);
      }
      return map;
    },
  );

  const turnstileHostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const map = new Map<string, SurveyOption[]>();
    for (const question of survey.questions) {
      if (question.input === "text") continue;
      map.set(question.id, orderOptions(question));
    }
    setOrderedOptionsByQuestion(map);
  }, [survey]);

  useEffect(() => {
    if (!intakeReady || success) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await loadTurnstileScript();
        if (cancelled || !turnstileHostRef.current || !window.turnstile) {
          return;
        }
        if (widgetIdRef.current !== null) {
          return;
        }
        widgetIdRef.current = window.turnstile.render(turnstileHostRef.current, {
          sitekey: siteKey,
          action: TURNSTILE_ACTION_SURVEY,
          callback: (token) => {
            setTurnstileToken(token);
            setFormError(null);
          },
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      } catch {
        if (!cancelled) {
          setFormError(messages.errorTurnstile);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [intakeReady, success, siteKey, messages.errorTurnstile]);

  function resetTurnstile() {
    setTurnstileToken("");
    if (widgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore
      }
    }
  }

  function setSingleAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setFormError(null);
  }

  function toggleMultiAnswer(
    question: SurveyChoiceQuestion,
    optionId: string,
  ) {
    const questionId = question.id;
    const exclusive = exclusiveOptionId(questionId);
    const maxSelect = question.max_select;

    setAnswers((prev) => {
      const current = prev[questionId];
      const selected = Array.isArray(current) ? [...current] : [];

      if (exclusive) {
        if (optionId === exclusive) {
          // Toggle exclusive option off when clicked again.
          if (selected.includes(exclusive)) {
            const next = { ...prev };
            delete next[questionId];
            return next;
          }
          return { ...prev, [questionId]: [exclusive] };
        }
        const withoutExclusive = selected.filter((id) => id !== exclusive);
        const idx = withoutExclusive.indexOf(optionId);
        if (idx >= 0) {
          withoutExclusive.splice(idx, 1);
        } else {
          if (
            maxSelect !== undefined &&
            withoutExclusive.length >= maxSelect
          ) {
            return prev;
          }
          withoutExclusive.push(optionId);
        }
        if (withoutExclusive.length === 0) {
          const next = { ...prev };
          delete next[questionId];
          return next;
        }
        return { ...prev, [questionId]: withoutExclusive };
      }

      const idx = selected.indexOf(optionId);
      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        if (maxSelect !== undefined && selected.length >= maxSelect) {
          return prev;
        }
        selected.push(optionId);
      }
      if (selected.length === 0) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: selected };
    });
    setFormError(null);
  }

  function isOptionDisabled(question: SurveyQuestion, optionId: string): boolean {
    if (question.input !== "multi") return false;
    const exclusive = exclusiveOptionId(question.id);
    const current = answers[question.id];
    const selected = Array.isArray(current) ? current : [];

    if (exclusive && selected.includes(exclusive) && optionId !== exclusive) {
      return true;
    }

    const maxSelect = question.max_select;
    if (
      maxSelect !== undefined &&
      !selected.includes(optionId) &&
      selected.length >= maxSelect &&
      !(exclusive && optionId === exclusive)
    ) {
      return true;
    }

    return false;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!intakeReady || submitting) {
      return;
    }

    const validated = validateAnswers(survey, answers);
    if (!validated.ok) {
      setFormError(messages.errorValidation);
      return;
    }

    if (!turnstileToken) {
      setFormError(messages.errorTurnstile);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      survey_id: survey.id,
      survey_version: survey.version,
      locale,
      answers: validated.answers,
      email: email.trim() || null,
      report_opt_in: reportOptIn,
      website,
      turnstile_token: turnstileToken,
    };

    try {
      const response = await fetch(`${apiUrl}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201 || response.status === 204) {
        setOptInOnSuccess(Boolean(email.trim()) && reportOptIn);
        setSuccess(true);
        return;
      }

      if (response.status === 403) {
        setFormError(messages.errorTurnstile);
        resetTurnstile();
        return;
      }
      if (response.status === 429) {
        setFormError(messages.errorRateLimit);
        resetTurnstile();
        return;
      }
      if (response.status === 400) {
        setFormError(messages.errorValidation);
        resetTurnstile();
        return;
      }
      setFormError(messages.errorServer);
      resetTurnstile();
    } catch {
      setFormError(messages.errorNetwork);
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  }

  if (!intakeReady) {
    return (
      <div className={styles.root}>
        <p className={styles.unavailable} role="status">
          {messages.unavailable}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.root}>
        <div className={styles.success} role="status">
          <p>{messages.success}</p>
          {optInOnSuccess ? <p>{messages.successOptIn}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {survey.questions.map((question) => (
          <fieldset key={question.id} className={styles.question}>
            <legend className={styles.prompt}>
              {pickLocalized(question.prompt, locale)}
              {question.required ? (
                <span className={styles.required}>
                  {" "}
                  ({messages.requiredHint})
                </span>
              ) : null}
            </legend>
            {question.help ? (
              <p className={styles.help}>
                {pickLocalized(question.help, locale)}
              </p>
            ) : null}

            {question.input === "text" ? null : (
              <ul className={styles.options}>
                {(orderedOptionsByQuestion.get(question.id) ?? question.options).map(
                  (option) => {
                    const disabled = isOptionDisabled(question, option.id);
                    const inputId = `${formId}-${question.id}-${option.id}`;
                    const current = answers[question.id];

                    if (question.input === "single") {
                      return (
                        <li key={option.id}>
                          <label
                            className={styles.option}
                            htmlFor={inputId}
                          >
                            <input
                              id={inputId}
                              type="radio"
                              name={question.id}
                              value={option.id}
                              checked={current === option.id}
                              onChange={() =>
                                setSingleAnswer(question.id, option.id)
                              }
                              required={question.required}
                            />
                            <span>{pickLocalized(option.label, locale)}</span>
                          </label>
                        </li>
                      );
                    }

                    const selected = Array.isArray(current) ? current : [];
                    return (
                      <li key={option.id}>
                        <label
                          className={
                            disabled
                              ? `${styles.option} ${styles.disabled}`
                              : styles.option
                          }
                          htmlFor={inputId}
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            name={question.id}
                            value={option.id}
                            checked={selected.includes(option.id)}
                            disabled={disabled}
                            onChange={() =>
                              toggleMultiAnswer(question, option.id)
                            }
                          />
                          <span>{pickLocalized(option.label, locale)}</span>
                        </label>
                      </li>
                    );
                  },
                )}
              </ul>
            )}
          </fieldset>
        ))}

        <div className={styles.chrome}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={`${formId}-email`}>
              {messages.emailLabel}
            </label>
            <input
              id={`${formId}-email`}
              className={styles.emailInput}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={messages.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={reportOptIn}
              onChange={(e) => setReportOptIn(e.target.checked)}
            />
            <span>{messages.reportOptInLabel}</span>
          </label>

          <p className={styles.privacyHint}>
            {messages.privacyNearEmail}{" "}
            <Link href={`/${locale}/datenschutz/`}>
              {messages.privacyLinkLabel}
            </Link>
          </p>

          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor={`${formId}-website`}>{messages.honeypotLabel}</label>
            <input
              id={`${formId}-website`}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{messages.turnstileLabel}</span>
            <div
              className={styles.turnstileWrap}
              ref={turnstileHostRef}
            />
          </div>
        </div>

        {formError ? (
          <p className={`${styles.status} ${styles.error}`} role="alert">
            {formError}
          </p>
        ) : null}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submit}
            disabled={submitting}
          >
            {submitting ? messages.submitting : messages.submit}
          </button>
        </div>

        <p className={styles.disclaimer}>
          {messages.disclaimer}{" "}
          <Link href={`/${locale}/datenschutz/`}>
            {messages.privacyLinkLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}
