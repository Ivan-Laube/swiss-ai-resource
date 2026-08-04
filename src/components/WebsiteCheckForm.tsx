"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Locale, Messages } from "@/i18n";
import { pickLocalized, type LocalizedString } from "@/rules/schema";
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
};
function normalizeUrlInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
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
    lines.push(`HTTPS: ${evidence.https ? messages.statusFound : messages.statusNotFound}`);
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
      const mark = header.present ? messages.statusFound : messages.statusNotFound;
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
export function WebsiteCheckForm({ locale, messages }: Props) {
  const apiUrl = (process.env.NEXT_PUBLIC_SCAN_API_URL ?? "").replace(
    /\/$/,
    "",
  );
  const scanReady = apiUrl.length > 0;
  const [urlInput, setUrlInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const url = normalizeUrlInput(urlInput);
    if (!url) {
      setFormError(messages.errorBadUrl);
      return;
    }
    setScanning(true);
    setResult(null);
    try {
      const response = await fetch(`${apiUrl}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (response.status === 429) {
        setFormError(messages.errorRateLimit);
        return;
      }
      if (response.status === 400) {
        setFormError(messages.errorBadUrl);
        return;
      }
      if (response.status === 502 || response.status === 504) {
        setFormError(messages.errorUpstream);
        return;
      }
      if (!response.ok) {
        setFormError(messages.errorServer);
        return;
      }
      const payload: unknown = await response.json();
      if (!isScanResult(payload)) {
        setFormError(messages.errorServer);
        return;
      }
      setResult(payload);
    } catch {
      setFormError(messages.errorNetwork);
    } finally {
      setScanning(false);
    }
  }
  function resetReport() {
    setResult(null);
    setFormError(null);
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
            <p className={styles.caveat} role="status">
              {messages.staticScanCaveat}
            </p>
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
                      <li key={finding.id} className={styles.finding}>
                        <div className={styles.findingHeader}>
                          <h3 className={styles.findingTitle}>
                            {pickLocalized(finding.title, locale)}
                          </h3>
                          <span className={styles.findingStatus}>
                            {statusLabel(finding.status, messages)}
                          </span>
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
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {/* T36: reserved for future LLM policy-content pass */}
          {null}
          <p className={styles.disclaimer}>{messages.disclaimer}</p>
          <button
            type="button"
            className={styles.secondary}
            onClick={resetReport}
          >
            {messages.scanAgain}
          </button>
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
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submit}
            disabled={scanning}
          >
            {scanning ? messages.scanning : messages.submit}
          </button>
          {formError ? (
            <p className={`${styles.status} ${styles.error}`} role="alert">
              {formError}
            </p>
          ) : null}
        </div>
      </form>
      <p className={styles.disclaimer}>{messages.disclaimer}</p>
    </div>
  );
}
