import type { ResponseHeaderCheck } from "../../../../src/scanner/schema";
import type { Finding, HeaderEvidence } from "../types";

/**
 * Probe response headers for presence (non-empty values).
 */
export function runResponseHeaderCheck(
  check: ResponseHeaderCheck,
  headers: Headers,
): Finding {
  const results: HeaderEvidence["headers"] = check.headers.map((probe) => {
    const value = headers.get(probe.name);
    const present = value !== null && value.trim().length > 0;
    return {
      id: probe.id,
      name: probe.name,
      present,
      value: present ? value : null,
    };
  });

  const presentCount = results.filter((h) => h.present).length;
  let status: Finding["status"];
  if (presentCount === results.length) {
    status = "found";
  } else if (presentCount === 0) {
    status = "not_found";
  } else {
    status = "indeterminate";
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
    evidence: { headers: results },
  };
}
