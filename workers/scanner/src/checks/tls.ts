import type { TlsCheck } from "../../../../src/scanner/schema";
import {
  FetchTargetError,
  probeHttpRedirectToHttps,
  type FetchTargetResult,
} from "../fetch-target";
import type { ScanBudget } from "../scan-budget";
import type { Finding, TlsEvidence } from "../types";

function baseFinding(
  check: TlsCheck,
  status: Finding["status"],
  evidence: TlsEvidence,
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
 * TLS / HTTPS reachability + optional HTTP→HTTPS redirect check.
 */
export async function runTlsCheck(
  check: TlsCheck,
  fetched: FetchTargetResult,
  startUrl: URL,
  budget: ScanBudget,
): Promise<Finding> {
  let finalUrl: URL;
  try {
    finalUrl = new URL(fetched.finalUrl);
  } catch {
    return baseFinding(check, "not_found", {
      https: false,
      http_redirects_to_https: null,
    });
  }

  const https = finalUrl.protocol === "https:";

  if (!https) {
    return baseFinding(check, "not_found", {
      https: false,
      http_redirects_to_https: false,
    });
  }

  if (!check.require_https_redirect) {
    return baseFinding(check, "found", {
      https: true,
      http_redirects_to_https: null,
    });
  }

  // Already proven: user submitted http and we landed on https.
  if (startUrl.protocol === "http:" && https) {
    return baseFinding(check, "found", {
      https: true,
      http_redirects_to_https: true,
    });
  }

  try {
    const probe = await probeHttpRedirectToHttps(finalUrl, budget);
    if (probe.redirectsToHttps) {
      return baseFinding(check, "found", {
        https: true,
        http_redirects_to_https: true,
      });
    }
    return baseFinding(check, "not_found", {
      https: true,
      http_redirects_to_https: false,
    });
  } catch (error) {
    if (error instanceof FetchTargetError) {
      return baseFinding(check, "indeterminate", {
        https: true,
        http_redirects_to_https: null,
      });
    }
    return baseFinding(check, "indeterminate", {
      https: true,
      http_redirects_to_https: null,
    });
  }
}
