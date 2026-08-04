import type {
  CheckMethod,
  LegalBasis,
  LocalizedString,
  Severity,
} from "../../../src/scanner/schema";

export type FindingStatus = "found" | "not_found" | "indeterminate";

export type LinkVerifyStatus = "skipped" | "ok" | "failed";

export type TlsEvidence = {
  https: boolean;
  http_redirects_to_https: boolean | null;
};

export type LinkEvidence = {
  matched_text: string | null;
  matched_href: string | null;
  locale: string | null;
  verify_status: LinkVerifyStatus | null;
};

export type SignatureEvidence = {
  matched_signatures: { id: string; label: string }[];
};

export type HeaderEvidence = {
  headers: {
    id: string;
    name: string;
    present: boolean;
    value: string | null;
  }[];
};

export type FindingEvidence =
  | TlsEvidence
  | LinkEvidence
  | SignatureEvidence
  | HeaderEvidence;

export type Finding = {
  id: string;
  method: CheckMethod;
  severity: Severity;
  status: FindingStatus;
  title: LocalizedString;
  description: LocalizedString;
  legal_basis: LegalBasis;
  related_page: string | null;
  evidence: FindingEvidence;
};

export type ScanResult = {
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
