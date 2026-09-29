/**
 * Typed ScanResult builders grounded in data/scanner-checks.json so fixtures
 * stay aligned with the Worker response contract and check catalogue.
 */
import checksJson from "../../data/scanner-checks.json";
import type {
  Finding,
  FindingEvidence,
  FindingStatus,
  ScanResult,
} from "../../workers/scanner/src/types";
import type {
  ScannerCheck,
  ScannerChecksFile,
} from "../../src/scanner/schema";

const checksFile = checksJson as ScannerChecksFile;

function checkById(id: string): ScannerCheck {
  const found = checksFile.checks.find((c) => c.id === id);
  if (!found) {
    throw new Error(`Unknown check id: ${id}`);
  }
  return found;
}

function defaultEvidence(check: ScannerCheck): FindingEvidence {
  switch (check.method) {
    case "tls":
      return { https: true, http_redirects_to_https: true };
    case "link":
      return {
        matched_text: "Privacy Policy",
        matched_href: "https://example.ch/privacy",
        locale: "en",
        verify_status: "ok",
      };
    case "script_signature":
      return { matched_signatures: [] };
    case "response_header":
      return {
        headers: check.headers.map((h) => ({
          id: h.id,
          name: h.name,
          present: h.id === "hsts",
          value: h.id === "hsts" ? "max-age=63072000" : null,
        })),
      };
    case "static_scan_flag":
      return { matched_signatures: [] };
    default: {
      const _exhaustive: never = check;
      void _exhaustive;
      return { matched_signatures: [] };
    }
  }
}

function defaultStatus(check: ScannerCheck): FindingStatus {
  switch (check.method) {
    case "tls":
      return "found";
    case "link":
      return check.id === "privacy-policy-link" ? "found" : "not_found";
    case "script_signature":
      return check.id === "third-party-trackers" ? "found" : "not_found";
    case "response_header":
      return "not_found";
    case "static_scan_flag":
      return "not_found";
    default: {
      const _exhaustive: never = check;
      void _exhaustive;
      return "not_found";
    }
  }
}

function defaultFinding(check: ScannerCheck): Finding {
  const status = defaultStatus(check);
  let evidence = defaultEvidence(check);

  if (check.method === "script_signature" && check.id === "third-party-trackers") {
    evidence = {
      matched_signatures: [
        { id: "google-analytics", label: "Google Analytics (GA4 / gtag)" },
        { id: "google-fonts", label: "Google Fonts" },
      ],
    };
  }
  if (check.method === "link" && check.id === "impressum") {
    evidence = {
      matched_text: null,
      matched_href: null,
      locale: null,
      verify_status: null,
    };
  }
  if (check.method === "link" && check.id === "privacy-policy-link") {
    evidence = {
      matched_text: "Datenschutzerklärung",
      matched_href: "https://example.ch/datenschutz",
      locale: "de",
      verify_status: "ok",
    };
  }
  if (check.method === "script_signature" && check.id === "cookie-consent-tooling") {
    evidence = { matched_signatures: [] };
  }

  return {
    id: check.id,
    method: check.method,
    severity: check.severity,
    status,
    title: check.title,
    description: check.description,
    legal_basis: check.legal_basis,
    related_page: check.related_page,
    evidence,
  };
}

export type FindingOverride = Partial<
  Omit<Finding, "id" | "method" | "title" | "description" | "legal_basis">
> & {
  evidence?: FindingEvidence;
};

/** Full report with one finding per check in catalogue order. */
export function fullReport(
  overrides: Partial<Omit<ScanResult, "ok" | "findings">> & {
    findings?: Finding[];
  } = {},
): ScanResult {
  const findings =
    overrides.findings ?? checksFile.checks.map((c) => defaultFinding(c));
  return {
    ok: true,
    url: overrides.url ?? "https://example.ch/",
    finalUrl: overrides.finalUrl ?? overrides.url ?? "https://example.ch/",
    status: overrides.status ?? 200,
    contentType: overrides.contentType ?? "text/html; charset=utf-8",
    byteLength: overrides.byteLength ?? 4096,
    checks_version: overrides.checks_version ?? checksFile.version,
    static_scan_incomplete: overrides.static_scan_incomplete ?? false,
    findings,
  };
}

/** Replace a single finding by id; keep the rest of the default report. */
export function withFinding(
  id: string,
  override: FindingOverride,
): ScanResult {
  const base = fullReport();
  return {
    ...base,
    findings: base.findings.map((f) =>
      f.id === id
        ? {
            ...f,
            ...override,
            evidence: override.evidence ?? f.evidence,
          }
        : f,
    ),
  };
}

/** Report where static_scan_incomplete is true (GTM / SPA shell detected). */
export function dynamicSite(): ScanResult {
  const base = withFinding("static-scan-honesty-flag", {
    status: "found",
    evidence: {
      matched_signatures: [
        { id: "google-tag-manager", label: "Google Tag Manager" },
        { id: "next-js", label: "Next.js" },
      ],
    },
  });
  return { ...base, static_scan_incomplete: true };
}

/** Report with finalUrl different from url (redirect). */
export function redirectedReport(): ScanResult {
  return fullReport({
    url: "https://example.ch/",
    finalUrl: "https://www.example.ch/",
  });
}

/** Report whose evidence contains HTML that must render as text (XSS probe). */
export function xssProbeReport(): ScanResult {
  const payload = '<img src=x onerror=window.__xss=1>';
  return withFinding("privacy-policy-link", {
    status: "found",
    evidence: {
      matched_text: payload,
      matched_href: `https://example.ch/${payload}`,
      locale: "en",
      verify_status: "ok",
    },
  });
}

export function checkMeta(id: string): ScannerCheck {
  return checkById(id);
}

export { checksFile };
