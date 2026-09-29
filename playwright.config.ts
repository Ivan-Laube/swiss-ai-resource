import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

/**
 * Two projects:
 * - configured: out-e2e with SCAN_API_URL + SURVEY_API_URL + Turnstile site key
 * - unconfigured: out-e2e-unconfigured (empty NEXT_PUBLIC_*) → unavailable UI
 *
 * Served via `wrangler pages dev` so Cloudflare Pages applies out/_headers
 * (hashed CSP, COOP/CORP, HSTS). Turnstile + /scan + /submit are mocked in fixtures.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "configured",
      testMatch: /(?:website-check|survey|benchmark)\/(?!unconfigured).*\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:8799",
      },
    },
    {
      name: "unconfigured",
      testMatch: /(?:website-check|survey|benchmark)\/unconfigured\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:8798",
      },
    },
  ],
  webServer: [
    {
      command:
        "npx wrangler pages dev out-e2e --port 8799 --ip 127.0.0.1 --compatibility-date=2026-07-01",
      url: "http://127.0.0.1:8799/en/website-check/",
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command:
        "npx wrangler pages dev out-e2e-unconfigured --port 8798 --ip 127.0.0.1 --compatibility-date=2026-07-01",
      url: "http://127.0.0.1:8798/en/website-check/",
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
});
