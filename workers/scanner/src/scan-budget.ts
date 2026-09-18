/** Per-request wall-clock deadline + DoH memoization for the scanner. */

export const FETCH_TIMEOUT_MS = 8_000;

export type ScanBudget = {
  /** Shared abort signal for all outbound fetches and DoH lookups. */
  signal: AbortSignal;
  /** Hostname → in-flight/completed DoH resolution (A+AAAA IPs). */
  dnsCache: Map<string, Promise<string[]>>;
  /** Clear the wall-clock timer (call from a `finally`). */
  dispose: () => void;
};

/**
 * One AbortController for the whole scan: target GET, redirect hops, TLS
 * HTTP probe, link HEAD verifies, and DoH lookups all share this signal.
 */
export function createScanBudget(
  timeoutMs: number = FETCH_TIMEOUT_MS,
): ScanBudget {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    dnsCache: new Map(),
    dispose: () => {
      clearTimeout(timer);
    },
  };
}
