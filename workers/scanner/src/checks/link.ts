import type { LinkCheck } from "../../../../src/scanner/schema";
import { FetchTargetError, headTarget } from "../fetch-target";
import { extractAnchors, findMatchingAnchor } from "../html";
import type { ScanBudget } from "../scan-budget";
import { assertSafeScanUrl } from "../url-guard";
import type { Finding, LinkEvidence } from "../types";

function baseFinding(
  check: LinkCheck,
  status: Finding["status"],
  evidence: LinkEvidence,
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

/**
 * Link keyword detection + optional HEAD verification of the first match.
 */
export async function runLinkCheck(
  check: LinkCheck,
  html: string,
  baseUrl: string,
  budget: ScanBudget,
): Promise<Finding> {
  const anchors = extractAnchors(html);
  const match = findMatchingAnchor(anchors, check.patterns, baseUrl);

  if (!match) {
    return baseFinding(check, "not_found", {
      matched_text: null,
      matched_href: null,
      locale: null,
      verify_status: null,
    });
  }

  const evidenceBase: LinkEvidence = {
    matched_text: match.anchor.text || match.pattern,
    matched_href: match.absoluteHref,
    locale: match.locale,
    verify_status: check.verify_link ? "failed" : "skipped",
  };

  if (!check.verify_link) {
    return baseFinding(check, "found", {
      ...evidenceBase,
      verify_status: "skipped",
    });
  }

  const guarded = await assertSafeScanUrl(match.absoluteHref, budget);
  if (!guarded.ok) {
    return baseFinding(check, "indeterminate", {
      ...evidenceBase,
      verify_status: "failed",
    });
  }

  try {
    const head = await headTarget(guarded.url, budget);
    if (head.status >= 200 && head.status < 400) {
      return baseFinding(check, "found", {
        ...evidenceBase,
        matched_href: head.finalUrl,
        verify_status: "ok",
      });
    }
    return baseFinding(check, "indeterminate", {
      ...evidenceBase,
      verify_status: "failed",
    });
  } catch (error) {
    if (error instanceof FetchTargetError) {
      return baseFinding(check, "indeterminate", {
        ...evidenceBase,
        verify_status: "failed",
      });
    }
    return baseFinding(check, "indeterminate", {
      ...evidenceBase,
      verify_status: "failed",
    });
  }
}
