/**
 * Post-build CSP for the static export (wired as `postbuild`).
 *
 * Cloudflare Pages silently drops `_headers` values longer than 2,000
 * characters. A single site-wide policy listing every page's inline-script
 * hashes grew past that (6k+ chars), so production served no CSP at all.
 * The policy is therefore split:
 *
 * - Per page: a `<meta http-equiv="Content-Security-Policy">` injected into
 *   each HTML file, holding only that page's inline-script sha256 hashes
 *   (a few hundred chars). This is the policy that locks down scripts.
 * - Site-wide header in `out/_headers`: the short, header-only directives
 *   that a meta policy cannot express (`frame-ancestors`) plus a few
 *   hardening ones. Both policies are enforced together by the browser.
 *
 * Also injects COOP/CORP and detaches Access-Control-Allow-Origin.
 * The script is idempotent: re-running replaces the injected meta tags.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = path.join(process.cwd(), "out");
const HEADERS_PATH = path.join(OUT_DIR, "_headers");

/** Cloudflare Pages drops header values longer than this. */
export const PAGES_HEADER_VALUE_LIMIT = 2000;

const INLINE_SCRIPT_RE =
  /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const META_CSP_RE =
  /<meta http-equiv="Content-Security-Policy" content="[^"]*"\s*\/?>/gi;
const CHARSET_META_RE = /<meta charSet="utf-8"\s*\/?>/i;
const HEAD_OPEN_RE = /<head(\s[^>]*)?>/i;

/** Header policy: directives that must (or may) live in the HTTP header. */
export const HEADER_CSP = [
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

async function* walkHtml(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

function sha256Csp(content: string): string {
  const digest = createHash("sha256").update(content, "utf8").digest("base64");
  return `'sha256-${digest}'`;
}

export function inlineScriptHashes(html: string): string[] {
  const hashes = new Set<string>();
  INLINE_SCRIPT_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_SCRIPT_RE.exec(html)) !== null) {
    const body = match[1] ?? "";
    if (body.length === 0) continue;
    hashes.add(sha256Csp(body));
  }
  return [...hashes].sort();
}

/** Per-page policy delivered via <meta>. No frame-ancestors (ignored in meta). */
export function buildMetaCsp(scriptHashes: string[]): string {
  const scriptSrc = [
    "script-src 'self'",
    ...scriptHashes,
    "https://challenges.cloudflare.com",
  ].join(" ");

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://api.aicompliant.ch https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** Insert (or replace) the meta CSP right after <meta charset>, before any script. */
export function injectMetaCsp(html: string, csp: string): string {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp}"/>`;
  const cleaned = html.replace(META_CSP_RE, "");

  const charset = CHARSET_META_RE.exec(cleaned);
  if (charset) {
    const at = charset.index + charset[0].length;
    return cleaned.slice(0, at) + tag + cleaned.slice(at);
  }
  const head = HEAD_OPEN_RE.exec(cleaned);
  if (!head) {
    throw new Error("csp-hashes: HTML without <head>");
  }
  const at = head.index + head[0].length;
  return cleaned.slice(0, at) + tag + cleaned.slice(at);
}

function rewriteHeaders(raw: string, csp: string): string {
  const lines = raw.split(/\r?\n/);
  const out: string[] = [];
  let sawCsp = false;
  let sawCoop = false;
  let sawCorp = false;
  let sawDetachAcao = false;

  for (const line of lines) {
    if (/^\s*Content-Security-Policy\s*:/i.test(line)) {
      out.push(`  Content-Security-Policy: ${csp}`);
      sawCsp = true;
      continue;
    }
    if (/^\s*Cross-Origin-Opener-Policy\s*:/i.test(line)) {
      out.push(`  Cross-Origin-Opener-Policy: same-origin`);
      sawCoop = true;
      continue;
    }
    if (/^\s*Cross-Origin-Resource-Policy\s*:/i.test(line)) {
      out.push(`  Cross-Origin-Resource-Policy: same-origin`);
      sawCorp = true;
      continue;
    }
    if (/^\s*!\s*Access-Control-Allow-Origin\s*$/i.test(line)) {
      out.push(`  ! Access-Control-Allow-Origin`);
      sawDetachAcao = true;
      continue;
    }
    // Drop any explicit ACAO so we can detach Cloudflare's default *.
    if (/^\s*Access-Control-Allow-Origin\s*:/i.test(line)) {
      continue;
    }
    out.push(line);
  }

  // Ensure required headers exist under the first `/*` block.
  if (!sawCsp || !sawCoop || !sawCorp || !sawDetachAcao) {
    const rebuilt: string[] = [];
    let injected = false;
    for (const line of out) {
      rebuilt.push(line);
      if (!injected && /^\s*\/\*\s*$/.test(line)) {
        if (!sawDetachAcao) {
          rebuilt.push(`  ! Access-Control-Allow-Origin`);
        }
        if (!sawCsp) {
          rebuilt.push(`  Content-Security-Policy: ${csp}`);
        }
        if (!sawCoop) {
          rebuilt.push(`  Cross-Origin-Opener-Policy: same-origin`);
        }
        if (!sawCorp) {
          rebuilt.push(`  Cross-Origin-Resource-Policy: same-origin`);
        }
        injected = true;
      }
    }
    return rebuilt.join("\n");
  }

  return out.join("\n");
}

/** Fail the build if any header value would be dropped by Cloudflare Pages. */
function assertHeaderValuesFit(headers: string): void {
  for (const line of headers.split(/\r?\n/)) {
    const match = /^\s+([A-Za-z-]+):\s*(.*)$/.exec(line);
    if (match && match[2]!.length > PAGES_HEADER_VALUE_LIMIT) {
      throw new Error(
        `csp-hashes: ${match[1]} value is ${match[2]!.length} chars; ` +
          `Cloudflare Pages drops values over ${PAGES_HEADER_VALUE_LIMIT}.`,
      );
    }
  }
}

async function main(): Promise<void> {
  let pages = 0;
  let maxHashes = 0;
  let maxMetaLength = 0;
  for await (const file of walkHtml(OUT_DIR)) {
    const html = await readFile(file, "utf8");
    const hashes = inlineScriptHashes(html);
    const csp = buildMetaCsp(hashes);
    await writeFile(file, injectMetaCsp(html, csp), "utf8");
    pages += 1;
    maxHashes = Math.max(maxHashes, hashes.length);
    maxMetaLength = Math.max(maxMetaLength, csp.length);
  }
  console.log(
    `csp-hashes: meta CSP in ${pages} HTML files ` +
      `(max ${maxHashes} script hashes, max ${maxMetaLength} chars)`,
  );

  let raw: string;
  try {
    raw = await readFile(HEADERS_PATH, "utf8");
  } catch {
    throw new Error(`Missing ${HEADERS_PATH} — run next build first`);
  }

  const next = rewriteHeaders(raw, HEADER_CSP);
  assertHeaderValuesFit(next);
  await writeFile(HEADERS_PATH, next.endsWith("\n") ? next : `${next}\n`, "utf8");
  console.log("csp-hashes: wrote out/_headers (header CSP: frame-ancestors etc.)");
}

// Only run when executed directly (the helpers are imported by tests).
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
