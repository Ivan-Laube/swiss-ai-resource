import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

/**
 * Lock the security headers (incl. CSP policy shape from scripts/csp-hashes.ts)
 * in both e2e builds' _headers.
 *
 * wrangler pages dev silently drops CSP lines over ~2000 chars (hashed script-src
 * from postbuild), so this file-level assert catches policy regressions even when
 * the runtime header is truncated locally. Only script-src sha256-* hashes may vary.
 */

const SHA256_TOKEN = /^'sha256-[A-Za-z0-9+/=]+'$/;
const TURNSTILE = "https://challenges.cloudflare.com";
const SCAN_API = "https://api.aicompliant.ch";

/** Fixed directives from buildCsp() — exact token lists. */
const FIXED_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'"],
  "connect-src": ["'self'", SCAN_API, TURNSTILE],
  "frame-src": [TURNSTILE],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

function parseCspDirectives(cspValue: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const part of cspValue.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    const name = tokens[0]!.toLowerCase();
    map.set(name, tokens.slice(1));
  }
  return map;
}

/** Non-CSP security headers in the `/*` block — exact values. */
const FIXED_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

/** Header lines of the first `/*` block in a Cloudflare Pages _headers file. */
function globalBlockHeaders(raw: string): Map<string, string> {
  const headers = new Map<string, string>();
  let inBlock = false;
  for (const line of raw.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      if (inBlock) break;
      inBlock = line.trim() === "/*";
      continue;
    }
    if (!inBlock) continue;
    const match = /^\s+([A-Za-z-]+):\s*(.*)$/.exec(line);
    if (match) headers.set(match[1]!, match[2]!.trim());
  }
  return headers;
}

for (const build of ["out-e2e", "out-e2e-unconfigured"] as const) {
  test.describe(`${build} build headers`, () => {
    const readHeaders = () =>
      globalBlockHeaders(
        readFileSync(path.join(process.cwd(), build, "_headers"), "utf8"),
      );

    test("security headers match locked values", () => {
      const headers = readHeaders();
      for (const [name, value] of Object.entries(FIXED_HEADERS)) {
        expect(headers.get(name), name).toBe(value);
      }
    });

    test("CSP matches locked policy (hashes may vary)", () => {
      const cspValue = readHeaders().get("Content-Security-Policy");
      expect(cspValue, "Content-Security-Policy header missing").toBeTruthy();

      const directives = parseCspDirectives(cspValue!);

      const expectedNames = new Set([
        ...Object.keys(FIXED_DIRECTIVES),
        "script-src",
      ]);
      expect(
        [...directives.keys()].sort(),
        "unexpected or missing CSP directives",
      ).toEqual([...expectedNames].sort());

      for (const [name, expected] of Object.entries(FIXED_DIRECTIVES)) {
        expect(directives.get(name), `${name} tokens`).toEqual(expected);
      }

      const scriptSrc = directives.get("script-src")!;
      expect(scriptSrc, "script-src must allow self").toContain("'self'");
      expect(scriptSrc, "script-src must allow Turnstile").toContain(TURNSTILE);

      const hashes = scriptSrc.filter(
        (token) => token !== "'self'" && token !== TURNSTILE,
      );
      expect(
        hashes.length,
        "expected at least one script-src sha256 hash",
      ).toBeGreaterThanOrEqual(1);
      for (const token of hashes) {
        // Rejects 'unsafe-inline', 'unsafe-eval', and any extra origin.
        expect(
          token,
          `script-src token must be a sha256 hash, got ${token}`,
        ).toMatch(SHA256_TOKEN);
      }
    });
  });
}
