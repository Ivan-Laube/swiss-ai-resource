import type {
  ScriptSignatureCheck,
  Signature,
  StaticScanFlagCheck,
} from "../../../../src/scanner/schema";
import type { Finding, SignatureEvidence } from "../types";

function matchSignatures(
  html: string,
  signatures: Signature[],
): { id: string; label: string }[] {
  const matched: { id: string; label: string }[] = [];
  for (const sig of signatures) {
    const hit = sig.patterns.some((pattern) => html.includes(pattern));
    if (hit) {
      matched.push({ id: sig.id, label: sig.label });
    }
  }
  return matched;
}

function baseFinding(
  check: ScriptSignatureCheck | StaticScanFlagCheck,
  status: Finding["status"],
  evidence: SignatureEvidence,
): Finding {
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

/** Substring signature scan for CMP / tracker checks. */
export function runScriptSignatureCheck(
  check: ScriptSignatureCheck,
  html: string,
): Finding {
  const matched_signatures = matchSignatures(html, check.signatures);
  return baseFinding(
    check,
    matched_signatures.length > 0 ? "found" : "not_found",
    { matched_signatures },
  );
}

/** Honesty flag: GTM / SPA shell signatures imply incomplete static scan. */
export function runStaticScanFlagCheck(
  check: StaticScanFlagCheck,
  html: string,
): Finding {
  const matched_signatures = matchSignatures(html, check.signatures);
  return baseFinding(
    check,
    matched_signatures.length > 0 ? "found" : "not_found",
    { matched_signatures },
  );
}
