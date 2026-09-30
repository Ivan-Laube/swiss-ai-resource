import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

/**
 * Lock the security headers and the per-page CSP produced by
 * scripts/csp-hashes.ts in both e2e builds.
 *
 * The CSP is split (see csp-hashes.ts): a short site-wide header policy
 * (frame-ancestors etc.) plus a per-page <meta> policy with that page's
 * inline-script hashes. Cloudflare Pages drops header values over 2,000
 * chars, which is how production once ended up with no CSP at all — so
 * header values are also length-checked here.
 */

const PAGES_HEADER_VALUE_LIMIT = 2000;
const SHA256_TOKEN = /^'sha256-[A-Za-z0-9+/=]+'$/;
const TURNSTILE = "https://challenges.cloudflare.com";
const SCAN_API = "https://api.aicompliant.ch";

/** Header CSP: exact directive set. */
const HEADER_CSP_DIRECTIVES: Record<string, string[]> = {
  "frame-ancestors": ["'none'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

/** Meta CSP: exact token lists for everything except script-src hashes. */
const META_FIXED_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'"],
  "connect-src": ["'self'", SCAN_API, TURNSTILE],
  "frame-src": [TURNSTILE],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "upgrade-insecure-requests": [],
};

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

const INLINE_SCRIPT_RE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const META_CSP_RE =
  /<meta http-equiv="Content-Security-Policy" content="([^"]*)"\s*\/?>/gi;

function parseCspDirectives(cspValue: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const part of cspValue.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    map.set(tokens[0]!.toLowerCase(), tokens.slice(1));
  }
  return map;
}

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

function listHtml(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listHtml(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function inlineScriptHashes(html: string): string[] {
  const hashes = new Set<string>();
  for (const match of html.matchAll(INLINE_SCRIPT_RE)) {
    const body = match[1] ?? "";
    if (!body) continue;
    hashes.add(
      `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`,
    );
  }
  return [...hashes].sort();
}

for (const build of ["out-e2e", "out-e2e-unconfigured"] as const) {
  test.describe(`${build} security headers and CSP`, () => {
    const buildDir = path.join(process.cwd(), build);
    const readHeaders = () =>
      globalBlockHeaders(readFileSync(path.join(buildDir, "_headers"), "utf8"));

    test("security headers match locked values", () => {
      const headers = readHeaders();
      for (const [name, value] of Object.entries(FIXED_HEADERS)) {
        expect(headers.get(name), name).toBe(value);
      }
    });

    test("every header value fits Cloudflare Pages' 2,000-char limit", () => {
      for (const [name, value] of readHeaders()) {
        expect(value.length, `${name} would be dropped`).toBeLessThanOrEqual(
          PAGES_HEADER_VALUE_LIMIT,
        );
      }
    });

    test("header CSP is the locked frame-ancestors policy", () => {
      const cspValue = readHeaders().get("Content-Security-Policy");
      expect(cspValue, "Content-Security-Policy header missing").toBeTruthy();
      const directives = parseCspDirectives(cspValue!);
      expect(Object.fromEntries(directives)).toEqual(HEADER_CSP_DIRECTIVES);
    });

    test("every HTML page has one meta CSP, before any script, hashing exactly its inline scripts", () => {
      const files = listHtml(buildDir);
      expect(files.length).toBeGreaterThan(10);

      for (const file of files) {
        const rel = path.relative(buildDir, file);
        const html = readFileSync(file, "utf8");
        const metas = [...html.matchAll(META_CSP_RE)];
        expect(metas.length, `${rel}: meta CSP count`).toBe(1);

        const metaIndex = metas[0]!.index!;
        const firstScript = html.search(/<script\b/i);
        if (firstScript !== -1) {
          expect(metaIndex, `${rel}: meta CSP must precede scripts`).toBeLessThan(
            firstScript,
          );
        }

        const directives = parseCspDirectives(metas[0]![1]!);
        expect(
          [...directives.keys()].sort(),
          `${rel}: directive set`,
        ).toEqual([...Object.keys(META_FIXED_DIRECTIVES), "script-src"].sort());
        for (const [name, expected] of Object.entries(META_FIXED_DIRECTIVES)) {
          expect(directives.get(name), `${rel}: ${name}`).toEqual(expected);
        }

        const scriptSrc = directives.get("script-src")!;
        expect(scriptSrc, `${rel}: script-src self`).toContain("'self'");
        expect(scriptSrc, `${rel}: script-src Turnstile`).toContain(TURNSTILE);
        const hashes = scriptSrc.filter(
          (token) => token !== "'self'" && token !== TURNSTILE,
        );
        // Rejects 'unsafe-inline', 'unsafe-eval' and any extra origin.
        for (const token of hashes) {
          expect(token, `${rel}: script-src token`).toMatch(SHA256_TOKEN);
        }
        expect(hashes.sort(), `${rel}: hashes match inline scripts`).toEqual(
          inlineScriptHashes(html),
        );
      }
    });
  });
}
