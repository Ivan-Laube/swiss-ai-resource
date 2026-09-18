import checksJson from "../../../data/scanner-checks.json";
import { parseScannerChecks } from "../../../src/scanner/schema";

import {
  BodyTooLargeError,
  MAX_SCAN_BODY_BYTES,
  readJsonWithLimit,
} from "./body-limit";
import {
  isAllowedOrigin,
  jsonResponse,
  optionsResponse,
  rejectIfDisallowedOrigin,
} from "./cors";
import { runChecks } from "./engine";
import type { Env } from "./env";
import { FetchTargetError, fetchTarget } from "./fetch-target";
import { createScanBudget } from "./scan-budget";
import { assertSafeScanUrl } from "./url-guard";

const checksFile = parseScannerChecks(checksJson);

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

function siteOrigin(env: Env): string {
  const origin = env.SITE_ORIGIN?.trim();
  if (!origin) {
    throw new Error("SITE_ORIGIN is not configured");
  }
  return origin;
}

function misconfiguredSiteOrigin(): Response {
  return new Response(
    JSON.stringify({ error: "SITE_ORIGIN is not configured" }),
    {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
  );
}

function parseScanUrl(
  body: unknown,
): { ok: true; url: string } | { ok: false; error: string } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Request body must be a JSON object" };
  }

  const url = (body as { url?: unknown }).url;
  if (typeof url !== "string") {
    return { ok: false, error: "url is required and must be a string" };
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "url must be a non-empty string" };
  }

  return { ok: true, url: trimmed };
}

function fetchErrorResponse(
  error: FetchTargetError,
  origin: string,
): Response {
  switch (error.kind) {
    case "blocked":
      return jsonResponse({ error: error.message }, 400, origin);
    case "timeout":
      return jsonResponse({ error: error.message }, 504, origin);
    case "oversized":
      return jsonResponse({ error: error.message }, 502, origin);
    case "redirects":
      return jsonResponse({ error: error.message }, 502, origin);
    case "upstream":
      return jsonResponse({ error: error.message }, 502, origin);
    default:
      return jsonResponse({ error: "Fetch failed" }, 502, origin);
  }
}

async function handleScan(
  request: Request,
  env: Env,
  origin: string,
): Promise<Response> {
  const ip = clientIp(request);

  const { success: withinLimit } = await env.SCANNER_RATE_LIMITER.limit({
    key: ip,
  });
  if (!withinLimit) {
    return jsonResponse({ error: "Too many requests" }, 429, origin);
  }

  let body: unknown;
  try {
    body = await readJsonWithLimit(request, MAX_SCAN_BODY_BYTES);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return jsonResponse({ error: "Request body too large" }, 413, origin);
    }
    return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
  }

  const parsed = parseScanUrl(body);
  if (!parsed.ok) {
    return jsonResponse({ error: parsed.error }, 400, origin);
  }

  const budget = createScanBudget();
  try {
    const guarded = await assertSafeScanUrl(parsed.url, budget);
    if (!guarded.ok) {
      if (guarded.timedOut) {
        return jsonResponse({ error: guarded.error }, 504, origin);
      }
      return jsonResponse({ error: guarded.error }, 400, origin);
    }

    let fetched;
    try {
      fetched = await fetchTarget(guarded.url, budget);
    } catch (error) {
      if (error instanceof FetchTargetError) {
        return fetchErrorResponse(error, origin);
      }
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse({ error: message }, 502, origin);
    }

    const result = await runChecks(
      fetched,
      checksFile,
      guarded.url,
      guarded.url.href,
      budget,
    );
    return jsonResponse(result, 200, origin);
  } finally {
    budget.dispose();
  }
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    let origin: string;
    try {
      origin = siteOrigin(env);
    } catch {
      return misconfiguredSiteOrigin();
    }

    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname === "/scan") {
      const rejected = rejectIfDisallowedOrigin(request, origin);
      if (rejected) return rejected;
      // Reflect the request Origin (SITE_ORIGIN or www ↔ apex sibling).
      return optionsResponse(request.headers.get("Origin")!);
    }

    if (request.method === "POST" && url.pathname === "/scan") {
      const rejected = rejectIfDisallowedOrigin(request, origin);
      if (rejected) return rejected;
      return handleScan(request, env, request.headers.get("Origin")!);
    }

    // Non-CORS routes: no Origin required; if present and allowed, reflect it.
    const requestOrigin = request.headers.get("Origin");
    const corsOrigin =
      requestOrigin && isAllowedOrigin(requestOrigin, origin)
        ? requestOrigin
        : origin;
    return jsonResponse({ error: "Not found" }, 404, corsOrigin);
  },
} satisfies ExportedHandler<Env>;

export default worker;
