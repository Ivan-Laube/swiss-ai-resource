"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { normalizeUrlInput } from "@/lib/normalize-url-input";
import { consumeQuickCheckHandoff } from "@/lib/quick-check-handoff";
import {
  loadTurnstileScript,
  TURNSTILE_ACTION_SCAN,
} from "@/lib/turnstile-client";
import { pickLocalized, type LocalizedString } from "@/rules/schema";
import { Button, Callout, Card, StatusPill, type StatusTone } from "@/components/ui";
import styles from "./WebsiteCheckForm.module.css";

type WebsiteCheckMessages = Messages["websiteCheck"];
type Severity = "high" | "medium" | "low" | "info";
type FindingStatus = "found" | "not_found" | "indeterminate";
type LegalBasis = {
  reference: string;
  url: string;
};
type FindingEvidence = {
  https?: boolean;
  http_redirects_to_https?: boolean | null;
  matched_text?: string | null;
  matched_href?: string | null;
  locale?: string | null;
  verify_status?: string | null;
  matched_signatures?: { id: string; label: string }[];
  headers?: {
    id: string;
    name: string;
    present: boolean;
    value: string | null;
  }[];
};
type Finding = {
  id: string;
  method: string;
  severity: Severity;
  status: FindingStatus;
  title: LocalizedString;
  description: LocalizedString;
  legal_basis: LegalBasis;
  related_page: string | null;
  evidence: FindingEvidence;
};
type ScanResult = {
  ok: true;
  url: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  byteLength: number;
  checks_version: number;
  static_scan_incomplete: boolean;
  findings: Finding[];
};
const SEVERITY_ORDER: Severity[] = ["high", "medium", "low", "info"];
type Props = {
  locale: Locale;
  messages: WebsiteCheckMessages;
  /** From survey.estimated_minutes — used in the post-result survey prompt. */
  surveyEstimatedMinutes: number;
};

function clearUrlFragment(): void {
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

function readUrlFromFragment(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#url=")) {
    return null;
  }
  const encoded = hash.slice("#url=".length);
  if (!encoded) {
    return "";
  }
  try {
    return decodeURIComponent(encoded);
  } catch {
    return "";
  }
}

function isScanResult(value: unknown): value is ScanResult {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    record.ok === true &&
    typeof record.url === "string" &&
    typeof record.finalUrl === "string" &&
    typeof record.static_scan_incomplete === "boolean" &&
    Array.isArray(record.findings)
  );
}
function statusLabel(
  status: FindingStatus,
  messages: WebsiteCheckMessages,
): string {
  switch (status) {
    case "found":
      return messages.statusFound;
    case "not_found":
      return messages.statusNotFound;
    case "indeterminate":
      return messages.statusIndeterminate;
  }
}

function statusTone(
  status: FindingStatus,
  severity: Severity,
): StatusTone {
  if (status === "found") return "success";
  if (status === "indeterminate") return "info";
  if (severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "neutral";
}
function severityLabel(
  severity: Severity,
  messages: WebsiteCheckMessages,
): string {
  switch (severity) {
    case "high":
      return messages.severityHigh;
    case "medium":
      return messages.severityMedium;
    case "low":
      return messages.severityLow;
    case "info":
      return messages.severityInfo;
  }
}
function evidenceLines(
  evidence: FindingEvidence,
  messages: WebsiteCheckMessages,
): string[] {
  const lines: string[] = [];
  if (typeof evidence.https === "boolean") {
    lines.push(
      `HTTPS: ${evidence.https ? messages.statusFound : messages.statusNotFound}`,
    );
    if (evidence.http_redirects_to_https !== undefined) {
      const redirect =
        evidence.http_redirects_to_https === null
          ? messages.statusIndeterminate
          : evidence.http_redirects_to_https
            ? messages.statusFound
            : messages.statusNotFound;
      lines.push(`HTTP → HTTPS: ${redirect}`);
    }
  }
  if (evidence.matched_href || evidence.matched_text) {
    if (evidence.matched_text) {
      lines.push(evidence.matched_text);
    }
    if (evidence.matched_href) {
      lines.push(evidence.matched_href);
    }
    if (evidence.verify_status) {
      lines.push(`HEAD: ${evidence.verify_status}`);
    }
  }
  if (evidence.matched_signatures?.length) {
    for (const signature of evidence.matched_signatures) {
      lines.push(signature.label);
    }
  }
  if (evidence.headers?.length) {
    for (const header of evidence.headers) {
      const mark = header.present
        ? messages.statusFound
        : messages.statusNotFound;
      lines.push(`${header.name}: ${mark}`);
    }
  }
  return lines;
}
function groupBySeverity(findings: Finding[]): Map<Severity, Finding[]> {
  const groups = new Map<Severity, Finding[]>();
  for (const severity of SEVERITY_ORDER) {
    groups.set(severity, []);
  }
  for (const finding of findings) {
    const bucket = groups.get(finding.severity);
    if (bucket) {
      bucket.push(finding);
    }
  }
  return groups;
}
export function WebsiteCheckForm({
  locale,
  messages,
  surveyEstimatedMinutes,
}: Props) {
  const apiUrl = (process.env.NEXT_PUBLIC_SCAN_API_URL ?? "").replace(
    /\/$/,
    "",
  );
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const scanReady = apiUrl.length > 0 && siteKey.length > 0;
  const [urlInput, setUrlInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileHostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const autoScanUrlRef = useRef<string | null>(null);
  const autoScanStartedRef = useRef(false);
  const turnstileTokenRef = useRef("");

  useEffect(() => {
    turnstileTokenRef.current = turnstileToken;
  }, [turnstileToken]);

  const fragmentAppliedRef = useRef(false);

  // Hash is not available during SSR; soft nav may apply it after first paint.
  useEffect(() => {
    function applyFromHash(): boolean {
      if (fragmentAppliedRef.current) {
        return true;
      }
      const raw = readUrlFromFragment();
      if (raw === null) {
        return false;
      }

      fragmentAppliedRef.current = true;
      const normalized = normalizeUrlInput(raw);
      if (!normalized) {
        setFormError(messages.errorBadUrl);
        if (raw) {
          setUrlInput(raw);
        }
        clearUrlFragment();
        return true;
      }

      setUrlInput(normalized);
      // Auto-scan only for our own homepage handoff; external #url= links
      // just prefill and wait for the visitor to click.
      if (scanReady && consumeQuickCheckHandoff(normalized)) {
        autoScanUrlRef.current = normalized;
      } else {
        clearUrlFragment();
      }
      return true;
    }

    if (applyFromHash()) {
      return undefined;
    }

    const onHashChange = () => {
      applyFromHash();
    };
    window.addEventListener("hashchange", onHashChange);
    const retryId = window.setTimeout(onHashChange, 0);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.clearTimeout(retryId);
    };
  }, [messages.errorBadUrl, scanReady]);

  useEffect(() => {
    if (!scanReady || result) {
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
          action: TURNSTILE_ACTION_SCAN,
          callback: (token) => {
            setTurnstileToken(token);
            setFormError((current) =>
              current === messages.errorTurnstile ? null : current,
            );
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
  }, [scanReady, result, siteKey, messages.errorTurnstile]);

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

  async function runScan(url: string, token: string) {
    setScanning(true);
    setResult(null);
    try {
      const response = await fetch(`${apiUrl}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, turnstile_token: token }),
      });
      if (response.status === 429) {
        setFormError(messages.errorRateLimit);
        resetTurnstile();
        return;
      }
      if (response.status === 403) {
        setFormError(messages.errorTurnstile);
        resetTurnstile();
        return;
      }
      if (response.status === 400) {
        const payload: unknown = await response.json().catch(() => null);
        const serverError =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "";
        setFormError(
          serverError.includes("turnstile")
            ? messages.errorTurnstile
            : messages.errorBadUrl,
        );
        resetTurnstile();
        return;
      }
      if (response.status === 502 || response.status === 504) {
        setFormError(messages.errorUpstream);
        resetTurnstile();
        return;
      }
      if (!response.ok) {
        setFormError(messages.errorServer);
        resetTurnstile();
        return;
      }
      const payload: unknown = await response.json();
      if (!isScanResult(payload)) {
        setFormError(messages.errorServer);
        resetTurnstile();
        return;
      }
      setResult(payload);
      setTurnstileToken("");
    } catch {
      setFormError(messages.errorNetwork);
      resetTurnstile();
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    if (!scanReady || result || scanning) {
      return;
    }
    if (autoScanStartedRef.current) {
      return;
    }
    const pendingUrl = autoScanUrlRef.current;
    if (!pendingUrl || !turnstileToken) {
      return;
    }

    autoScanStartedRef.current = true;
    autoScanUrlRef.current = null;
    clearUrlFragment();
    void runScan(pendingUrl, turnstileToken);
    // Intentionally only re-run when token / readiness changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot auto-scan from #url=
  }, [scanReady, turnstileToken, result, scanning]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const url = normalizeUrlInput(urlInput);
    if (!url) {
      setFormError(messages.errorBadUrl);
      return;
    }
    // Prefer React state; fall back to Turnstile's hidden input (widget can
    // look "passed" briefly while state is empty after reset/expiry).
    const domToken =
      document
        .querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
        ?.value?.trim() ?? "";
    const token = (turnstileTokenRef.current || turnstileToken || domToken).trim();
    if (!token) {
      setFormError(messages.errorTurnstile);
      return;
    }
    await runScan(url, token);
  }
  function resetReport() {
    setResult(null);
    setFormError(null);
    setTurnstileToken("");
  }
  if (!scanReady) {
    return (
      <div className={styles.root}>
        <p className={styles.unavailable} role="status">
          {messages.unavailable}
        </p>
      </div>
    );
  }
  if (result) {
    const groups = groupBySeverity(result.findings);
    const surveyPrompt = messages.surveyPrompt.replace(
      "{minutes}",
      String(surveyEstimatedMinutes),
    );
    return (
      <div className={styles.root}>
        <div className={styles.report} aria-live="polite">
          <dl className={styles.summary}>
            <dt>{messages.scannedUrl}</dt>
            <dd>{result.url}</dd>
            {result.finalUrl !== result.url ? (
              <>
                <dt>{messages.finalUrl}</dt>
                <dd>{result.finalUrl}</dd>
              </>
            ) : null}
          </dl>
          {result.static_scan_incomplete ? (
            <Callout tone="warning" className={styles.caveat}>
              {messages.staticScanCaveat}
            </Callout>
          ) : null}
          {SEVERITY_ORDER.map((severity) => {
            const findings = groups.get(severity) ?? [];
            if (findings.length === 0) {
              return null;
            }
            const headingId = `severity-${severity}`;
            return (
              <section
                key={severity}
                className={styles.severityGroup}
                aria-labelledby={headingId}
              >
                <h2 id={headingId} className={styles.severityTitle}>
                  {severityLabel(severity, messages)}
                </h2>
                <ul className={styles.findings}>
                  {findings.map((finding) => {
                    const evidence = evidenceLines(finding.evidence, messages);
                    return (
                      <li key={finding.id}>
                        <Card className={styles.finding}>
                          <div className={styles.findingHeader}>
                            <h3 className={styles.findingTitle}>
                              {pickLocalized(finding.title, locale)}
                            </h3>
                            <StatusPill
                              tone={statusTone(finding.status, finding.severity)}
                            >
                              {statusLabel(finding.status, messages)}
                            </StatusPill>
                          </div>
                          <p className={styles.findingDescription}>
                            {pickLocalized(finding.description, locale)}
                          </p>
                          <ul className={styles.metaList}>
                            <li>
                              {messages.legalBasis}:{" "}
                              <a
                                href={finding.legal_basis.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {finding.legal_basis.reference}
                              </a>
                            </li>
                            {finding.related_page ? (
                              <li>
                                {messages.relatedPage}:{" "}
                                <Link
                                  href={`/${locale}/${finding.related_page}/`}
                                >
                                  {finding.related_page}
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                          {evidence.length > 0 ? (
                            <div className={styles.evidence}>
                              <p className={styles.evidenceTitle}>
                                {messages.evidence}
                              </p>
                              <ul className={styles.evidenceList}>
                                {evidence.map((line) => (
                                  <li key={line}>{line}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {/* T36: reserved for future LLM policy-content pass */}
          {null}
          <Callout tone="neutral">{messages.disclaimer}</Callout>
          <div className={styles.reportActions}>
            <Button type="button" variant="secondary" onClick={resetReport}>
              {messages.scanAgain}
            </Button>
          </div>
          <Callout tone="info" className={styles.surveyPrompt}>
            <p>{surveyPrompt}</p>
            <Button
              variant="primary"
              href={`/${locale}/survey/`}
              className={styles.surveyPromptCta}
            >
              {messages.surveyPromptCta}
            </Button>
          </Callout>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="website-check-url">
            {messages.urlLabel}
          </label>
          <input
            id="website-check-url"
            className={styles.urlInput}
            type="text"
            name="url"
            inputMode="url"
            autoComplete="url"
            placeholder={messages.urlPlaceholder}
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            disabled={scanning}
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>{messages.turnstileLabel}</span>
          <div
            className={styles.turnstileWrap}
            ref={turnstileHostRef}
            data-turnstile-host
          />
        </div>
        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={scanning || !turnstileToken}
          >
            {scanning ? messages.scanning : messages.submit}
          </Button>
          {formError ? (
            <p className={`${styles.status} ${styles.error}`} role="alert">
              {formError}
            </p>
          ) : null}
        </div>
      </form>
      <Callout tone="neutral" className={styles.formDisclaimer}>
        {messages.disclaimer}
      </Callout>
    </div>
  );
}
