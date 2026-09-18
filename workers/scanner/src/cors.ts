export type CorsHeaders = Record<string, string>;

export function corsHeaders(origin: string): CorsHeaders {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/**
 * Exact SITE_ORIGIN match, plus www ↔ apex sibling (same scheme/port).
 * Missing Origin fails closed — browsers always send it on cross-origin POST.
 */
export function isAllowedOrigin(
  requestOrigin: string | null,
  siteOrigin: string,
): boolean {
  if (!requestOrigin) return false;
  if (requestOrigin === siteOrigin) return true;

  try {
    const allowed = new URL(siteOrigin);
    const incoming = new URL(requestOrigin);
    if (
      allowed.protocol !== incoming.protocol ||
      allowed.port !== incoming.port
    ) {
      return false;
    }
    const a = allowed.hostname;
    const b = incoming.hostname;
    return a === `www.${b}` || b === `www.${a}`;
  } catch {
    return false;
  }
}

/** 403 without CORS headers so foreign origins cannot read the body. */
export function forbiddenOriginResponse(): Response {
  return new Response(JSON.stringify({ error: "Origin not allowed" }), {
    status: 403,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/**
 * Returns a 403 Response when Origin is missing or not allowlisted;
 * otherwise null (caller proceeds and may emit CORS for siteOrigin).
 */
export function rejectIfDisallowedOrigin(
  request: Request,
  siteOrigin: string,
): Response | null {
  const requestOrigin = request.headers.get("Origin");
  if (!isAllowedOrigin(requestOrigin, siteOrigin)) {
    return forbiddenOriginResponse();
  }
  return null;
}

export function jsonResponse(
  body: unknown,
  status: number,
  origin: string,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

export function emptyResponse(status: number, origin: string): Response {
  return new Response(null, {
    status,
    headers: corsHeaders(origin),
  });
}

export function optionsResponse(origin: string): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
