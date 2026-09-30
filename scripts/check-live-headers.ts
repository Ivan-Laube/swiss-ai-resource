/**
 * Check the security headers and CSP a *deployed* site actually serves.
 *
 * The e2e tests check the build output; this checks what the CDN delivers,
 * which is how we'd have caught Cloudflare Pages silently dropping the
 * over-long CSP header. Fails when:
 * - a security header is missing, or the header CSP lacks frame-ancestors;
 * - a page has no meta CSP, allows 'unsafe-inline'/'unsafe-eval' scripts,
 *   or doesn't hash one of its own inline scripts (hydration would break).
 *
 * Usage: npm run check:live-headers [-- https://preview.example.pages.dev]
 * Default target: https://aicompliant.ch
 */
import { createHash } from "node:crypto";

const DEFAULT_ORIGIN = "https://aicompliant.ch";
const PATHS = ["/de/", "/fr/guides/", "/de/website-check/", "/de/does-not-exist/"];

const REQUIRED_HEADERS: Record<string, RegExp> = {
  "content-security-policy": /frame-ancestors 'none'/,
  "strict-transport-security": /max-age=\d+/,
  "x-frame-options": /^DENY$/i,
  "x-content-type-options": /^nosniff$/i,
  "referrer-policy": /strict-origin-when-cross-origin/,
};

const INLINE_SCRIPT_RE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const META_CSP_RE =
  /<meta http-equiv="Content-Security-Policy" content="([^"]*)"\s*\/?>/i;

function sha256(body: string): string {
  return `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`;
}

async function checkPath(origin: string, path: string): Promise<string[]> {
  const url = new URL(path, origin).href;
  const problems: string[] = [];
  const response = await fetch(url, { redirect: "follow" });
  const html = await response.text();

  for (const [name, pattern] of Object.entries(REQUIRED_HEADERS)) {
    const value = response.headers.get(name);
    if (!value) problems.push(`${url}: missing header ${name}`);
    else if (!pattern.test(value)) problems.push(`${url}: ${name} is "${value}"`);
  }

  const meta = META_CSP_RE.exec(html);
  if (!meta) {
    problems.push(`${url}: no <meta> CSP in HTML`);
    return problems;
  }
  const scriptSrc =
    meta[1]!
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("script-src"))
      ?.split(/\s+/)
      .slice(1) ?? [];
  if (scriptSrc.length === 0) problems.push(`${url}: meta CSP has no script-src`);
  for (const bad of ["'unsafe-inline'", "'unsafe-eval'"]) {
    if (scriptSrc.includes(bad)) problems.push(`${url}: script-src allows ${bad}`);
  }
  for (const match of html.matchAll(INLINE_SCRIPT_RE)) {
    const body = match[1] ?? "";
    if (body && !scriptSrc.includes(sha256(body))) {
      problems.push(`${url}: inline script not covered by meta CSP (${sha256(body)})`);
    }
  }
  return problems;
}

async function main(): Promise<void> {
  const origin = process.argv[2] ?? DEFAULT_ORIGIN;
  const problems: string[] = [];
  for (const path of PATHS) {
    problems.push(...(await checkPath(origin, path)));
  }
  if (problems.length > 0) {
    console.error(`check:live-headers FAILED for ${origin}:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(`check:live-headers ok (${origin}, ${PATHS.length} pages)`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
