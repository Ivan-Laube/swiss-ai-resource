"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { normalizeUrlInput } from "@/lib/normalize-url-input";
import { markQuickCheckHandoff } from "@/lib/quick-check-handoff";
import styles from "./QuickCheckPanel.module.css";

/** Only the strings the panel renders (keeps catalogues off the client). */
export type QuickCheckPanelStrings = {
  title: string;
  lead: string;
  urlLabel: string;
  submit: string;
  checksHeading: string;
  privacy: string;
  urlPlaceholder: string;
  errorBadUrl: string;
};

export type QuickCheckItem = {
  id: string;
  title: string;
};

type Props = {
  locale: Locale;
  strings: QuickCheckPanelStrings;
  checks: readonly QuickCheckItem[];
};

export function QuickCheckPanel({
  locale,
  strings,
  checks,
}: Props) {
  const inputId = useId();
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration flag
    setHydrated(true);
  }, []);

  function goToCheck() {
    setError(null);
    const url = normalizeUrlInput(urlInput);
    if (!url) {
      setError(strings.errorBadUrl);
      return;
    }
    // Lets /website-check/ auto-start the scan for this URL only (see
    // quick-check-handoff.ts); external #url= links merely prefill.
    markQuickCheckHandoff(url);
    // Full load so `#url=` is present on first paint (App Router soft nav
    // can apply the hash after WebsiteCheckForm's mount effect).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hash handoff
    window.location.assign(
      `/${locale}/website-check/#url=${encodeURIComponent(url)}`,
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToCheck();
  }

  return (
    <aside
      className={styles.panel}
      aria-labelledby="quick-check-heading"
      data-hydrated={hydrated ? "true" : "false"}
    >
      <h2 id="quick-check-heading" className={styles.title}>
        {strings.title}
      </h2>
      <p className={styles.lead}>{strings.lead}</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label className={styles.label} htmlFor={inputId}>
          {strings.urlLabel}
        </label>
        <div className={styles.row}>
          <input
            id={inputId}
            className={styles.input}
            type="url"
            name="url"
            inputMode="url"
            autoComplete="url"
            placeholder={strings.urlPlaceholder}
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className={styles.submit}
            disabled={!hydrated}
          >
            {strings.submit}
          </Button>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {checks.length > 0 ? (
        <div className={styles.checks}>
          <p className={styles.checksHeading}>{strings.checksHeading}</p>
          <ul className={styles.checkList}>
            {checks.map((check) => (
              <li key={check.id}>{check.title}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className={styles.privacy}>{strings.privacy}</p>
    </aside>
  );
}
