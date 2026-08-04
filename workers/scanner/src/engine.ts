import type { ScannerChecksFile } from "../../../src/scanner/schema";
import type { FetchTargetResult } from "./fetch-target";
import { runResponseHeaderCheck } from "./checks/headers";
import { runLinkCheck } from "./checks/link";
import {
  runScriptSignatureCheck,
  runStaticScanFlagCheck,
} from "./checks/signatures";
import { runTlsCheck } from "./checks/tls";
import type { Finding, ScanResult } from "./types";

/**
 * Run every check definition against the fetched page.
 */
export async function runChecks(
  fetched: FetchTargetResult,
  checksFile: ScannerChecksFile,
  startUrl: URL,
  requestUrl: string,
): Promise<ScanResult> {
  const findings: Finding[] = [];

  for (const check of checksFile.checks) {
    switch (check.method) {
      case "tls":
        findings.push(await runTlsCheck(check, fetched, startUrl));
        break;
      case "link":
        findings.push(
          await runLinkCheck(check, fetched.body, fetched.finalUrl),
        );
        break;
      case "script_signature":
        findings.push(runScriptSignatureCheck(check, fetched.body));
        break;
      case "response_header":
        findings.push(runResponseHeaderCheck(check, fetched.headers));
        break;
      case "static_scan_flag":
        findings.push(runStaticScanFlagCheck(check, fetched.body));
        break;
      default: {
        const _exhaustive: never = check;
        void _exhaustive;
        break;
      }
    }
  }

  const honesty = findings.find((f) => f.method === "static_scan_flag");
  const static_scan_incomplete = honesty?.status === "found";

  return {
    ok: true,
    url: requestUrl,
    finalUrl: fetched.finalUrl,
    status: fetched.status,
    contentType: fetched.contentType,
    byteLength: fetched.byteLength,
    checks_version: checksFile.version,
    static_scan_incomplete,
    findings,
  };
}
