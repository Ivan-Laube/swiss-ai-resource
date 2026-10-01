/**
 * Anonymous tool-usage counter for the API workers (Workers Analytics Engine).
 *
 * One data point per tool request: which tool, how it ended, the HTTP status.
 * Deliberately nothing else — no IP, no URL, no user agent, no country, no
 * survey content — so a data point cannot be tied to a person or a scan target.
 * Analytics Engine keeps data points for three months.
 *
 * Query (Cloudflare SQL API):
 *   SELECT blob1 AS tool, blob2 AS outcome, SUM(_sample_interval) AS requests
 *   FROM aicompliant_usage
 *   WHERE timestamp > NOW() - INTERVAL '7' DAY
 *   GROUP BY tool, outcome
 */

export type UsageTool = "scan" | "survey";

export type UsageOutcome =
  | "ok"
  | "bot_rejected"
  | "rate_limited"
  | "turnstile_failed"
  | "rejected"
  | "upstream_error"
  | "error";

/** Structural subset of `AnalyticsEngineDataset` so src/ needs no worker types. */
export interface UsageDataset {
  writeDataPoint(event: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

export function usageOutcome(status: number): UsageOutcome {
  if (status === 204) return "bot_rejected"; // survey honeypot fake success
  if (status >= 200 && status < 300) return "ok";
  if (status === 429) return "rate_limited";
  if (status === 403) return "turnstile_failed";
  if (status >= 400 && status < 500) return "rejected";
  if (status === 502 || status === 504) return "upstream_error";
  return "error";
}

/**
 * Records one tool request. Never throws: a metrics failure must not turn
 * into a failed scan or survey submission. No-op when the binding is absent
 * (local dev, tests).
 */
export function recordUsage(
  dataset: UsageDataset | undefined,
  tool: UsageTool,
  status: number,
): void {
  if (!dataset) return;
  try {
    dataset.writeDataPoint({
      indexes: [tool],
      blobs: [tool, usageOutcome(status)],
      doubles: [status],
    });
  } catch {
    // Swallow: usage counting is best-effort.
  }
}
