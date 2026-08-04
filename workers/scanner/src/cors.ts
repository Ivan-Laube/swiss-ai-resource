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
