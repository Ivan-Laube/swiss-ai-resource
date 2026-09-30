/**
 * One-time handoff from the homepage Quick-Check panel to /website-check/.
 *
 * The `#url=` fragment alone must not auto-start a scan: any external site
 * could link to `/website-check/#url=…` and make visitors trigger scans of
 * URLs they never typed. The panel marks the URL in sessionStorage right
 * before navigating; the form only auto-scans when that mark matches.
 * Direct links still prefill the field but wait for a click.
 */

const STORAGE_KEY = "aicompliant:quick-check-handoff";
/** A handoff older than this is ignored (the redirect is immediate). */
const MAX_AGE_MS = 60_000;

type Handoff = { url: string; at: number };

/** Called by the homepage panel just before navigating. */
export function markQuickCheckHandoff(url: string): void {
  try {
    const value: Handoff = { url, at: Date.now() };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode, policy): the form falls back to prefill.
  }
}

/**
 * True once if `url` was handed off by the panel moments ago.
 * Always clears the mark so it cannot be replayed.
 */
export function consumeQuickCheckHandoff(url: string): boolean {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw) as Partial<Handoff>;
    return (
      parsed.url === url &&
      typeof parsed.at === "number" &&
      Date.now() - parsed.at <= MAX_AGE_MS
    );
  } catch {
    return false;
  }
}
