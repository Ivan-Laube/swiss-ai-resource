/**
 * Post-build: replace CSP script-src 'unsafe-inline' with sha256 hashes of
 * every inline script tag under out/ (Next static export hydration).
 * Also injects COOP/CORP and detaches Access-Control-Allow-Origin if present.
 *
 * Run after `next build` (wired as `postbuild`).
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");
const HEADERS_PATH = path.join(OUT_DIR, "_headers");

const INLINE_SCRIPT_RE =
  /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

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

async function collectInlineScriptHashes(): Promise<string[]> {
  const hashes = new Set<string>();
  for await (const file of walkHtml(OUT_DIR)) {
    const html = await readFile(file, "utf8");
    INLINE_SCRIPT_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = INLINE_SCRIPT_RE.exec(html)) !== null) {
      const body = match[1] ?? "";
      if (body.length === 0) continue;
      hashes.add(sha256Csp(body));
    }
  }
  return [...hashes].sort();
}

function buildCsp(scriptHashes: string[]): string {
  const scriptSrc =
    scriptHashes.length > 0
      ? `script-src 'self' ${scriptHashes.join(" ")} https://challenges.cloudflare.com`
      : `script-src 'self' https://challenges.cloudflare.com`;

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
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
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

async function main(): Promise<void> {
  const hashes = await collectInlineScriptHashes();
  if (hashes.length === 0) {
    console.warn(
      "csp-hashes: no inline scripts found under out/ — leaving script-src without hashes.",
    );
  } else {
    console.log(
      `csp-hashes: ${hashes.length} unique inline script hash${hashes.length === 1 ? "" : "es"}`,
    );
  }

  let raw: string;
  try {
    raw = await readFile(HEADERS_PATH, "utf8");
  } catch {
    throw new Error(`Missing ${HEADERS_PATH} — run next build first`);
  }

  const csp = buildCsp(hashes);
  const next = rewriteHeaders(raw, csp);
  await writeFile(HEADERS_PATH, next.endsWith("\n") ? next : `${next}\n`, "utf8");
  console.log("csp-hashes: wrote out/_headers");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
