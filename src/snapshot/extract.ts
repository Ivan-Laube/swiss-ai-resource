import * as cheerio from "cheerio";
import { PDFParse } from "pdf-parse";

// TextDecoder, not Buffer#toString(encoding): the single project-wide tsconfig
// also type-checks workers/**, whose `/// <reference types="@cloudflare/workers-types" />`
// (nodejs_compat) declares a global `Buffer: any` that clobbers @types/node's
// Buffer#toString overloads here. TextDecoder sidesteps that ambient conflict
// and is the same idiom already used in workers/scanner/src/fetch-target.ts.
const utf8Decoder = new TextDecoder("utf-8");

export class ExtractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtractError";
  }
}

/** True when the response (or URL) looks like a PDF. */
export function isPdfSource(
  url: string,
  contentType: string | null,
): boolean {
  if (contentType) {
    const mime = contentType.split(";")[0].trim().toLowerCase();
    if (mime === "application/pdf") {
      return true;
    }
  }

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return pathname.endsWith(".pdf");
  } catch {
    return url.toLowerCase().includes(".pdf");
  }
}

/** True when the response (or URL) looks like JSON. */
export function isJsonSource(
  url: string,
  contentType: string | null,
): boolean {
  if (contentType) {
    const mime = contentType.split(";")[0].trim().toLowerCase();
    if (
      mime === "application/json" ||
      mime === "application/ld+json" ||
      mime.endsWith("+json")
    ) {
      return true;
    }
  }

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return pathname.endsWith(".json");
  } catch {
    return url.toLowerCase().includes(".json");
  }
}

/** Extract visible text from HTML using a CSS selector. */
export function extractHtmlText(html: string, selector: string): string {
  const $ = cheerio.load(html);
  $("script, style, noscript, template").remove();
  const nodes = $(selector);
  if (nodes.length === 0) {
    throw new ExtractError(
      `CSS selector "${selector}" matched no elements`,
    );
  }
  const text = nodes.text();
  if (!text.trim()) {
    throw new ExtractError(
      `CSS selector "${selector}" matched elements but produced empty text`,
    );
  }
  return text;
}

/** Extract full text from a PDF buffer. Ignores CSS selector. */
export async function extractPdfText(data: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(data) });
  try {
    const result = await parser.getText();
    const text = result.text ?? "";
    if (!text.trim()) {
      throw new ExtractError("PDF text extraction produced empty text");
    }
    return text;
  } finally {
    await parser.destroy();
  }
}

/**
 * Normalize JSON to stable UTF-8 text for snapshots.
 * Prefer a sorted participant-name dump when the payload looks like a DPF list;
 * otherwise pretty-print the full JSON with sorted object keys.
 */
export function extractJsonText(data: Buffer): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(utf8Decoder.decode(data)) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ExtractError(`Invalid JSON body: ${message}`);
  }

  const names = collectParticipantNames(parsed);
  if (names.length > 0) {
    const text = names.join("\n");
    if (!text.trim()) {
      throw new ExtractError("JSON participant list produced empty text");
    }
    return text;
  }

  const text = `${JSON.stringify(sortKeysDeep(parsed), null, 2)}\n`;
  if (!text.trim()) {
    throw new ExtractError("JSON extraction produced empty text");
  }
  return text;
}

function collectParticipantNames(parsed: unknown): string[] {
  const names = new Set<string>();

  function addName(value: unknown): void {
    if (typeof value === "string" && value.trim()) {
      names.add(value.trim());
    }
  }

  if (Array.isArray(parsed)) {
    for (const entry of parsed) {
      if (entry && typeof entry === "object") {
        const obj = entry as Record<string, unknown>;
        addName(obj.name ?? obj.organizationName ?? obj.orgName);
      } else {
        addName(entry);
      }
    }
  } else if (parsed && typeof parsed === "object") {
    const root = parsed as Record<string, unknown>;
    const lists = [
      root.organizations,
      root.participants,
      root.list,
      root.data,
      root.results,
    ];
    for (const list of lists) {
      if (!Array.isArray(list)) {
        continue;
      }
      for (const entry of list) {
        if (entry && typeof entry === "object") {
          const obj = entry as Record<string, unknown>;
          addName(obj.name ?? obj.organizationName ?? obj.orgName);
        } else {
          addName(entry);
        }
      }
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort((a, b) => a.localeCompare(b))) {
      sorted[key] = sortKeysDeep(obj[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Extract normalized-ready raw text from a fetched body.
 * PDFs use full-text extraction; JSON uses stable serialization;
 * HTML uses the source CSS selector.
 */
export async function extractText(options: {
  body: Buffer;
  url: string;
  contentType: string | null;
  selector: string;
}): Promise<string> {
  const { body, url, contentType, selector } = options;

  if (isPdfSource(url, contentType)) {
    return extractPdfText(body);
  }

  if (isJsonSource(url, contentType)) {
    return extractJsonText(body);
  }

  return extractHtmlText(utf8Decoder.decode(body), selector);
}
