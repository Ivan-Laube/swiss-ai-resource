import os from "node:os";
import path from "node:path";
import { defineConfig, devices, type Project } from "@playwright/test";

const isCI = !!process.env.CI;

/** Keep workerd SQLite off bind-mounted project dirs (breaks Docker-on-Windows). */
const WRANGLER_PERSIST_CONFIGURED = path.join(
  os.tmpdir(),
  "swiss-ai-e2e-configured",
);
const WRANGLER_PERSIST_UNCONFIGURED = path.join(
  os.tmpdir(),
  "swiss-ai-e2e-unconfigured",
);

const VISUAL_VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
] as const;

const VISUAL_THEMES = ["light", "dark"] as const;

function visualProjects(): Project[] {
  const projects: Project[] = [];
  for (const viewport of VISUAL_VIEWPORTS) {
    for (const theme of VISUAL_THEMES) {
      projects.push({
        name: `visual-${viewport.name}-${theme}`,
        testMatch: /visual\/.*\.spec\.ts/,
        use: {
          baseURL: "http://127.0.0.1:8799",
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
          reducedMotion: "reduce",
        },
      });
    }
  }
  return projects;
}

const A11Y_THEMES = ["light", "dark"] as const;

function a11yProjects(): Project[] {
  return A11Y_THEMES.map((theme) => ({
    name: `a11y-${theme}`,
    testMatch: /a11y\/.*\.spec\.ts/,
    use: {
      baseURL: "http://127.0.0.1:8799",
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce" as const,
    },
  }));
}

/**
 * Projects:
 * - configured: out-e2e with SCAN_API_URL + SURVEY_API_URL + Turnstile site key
 * - unconfigured: out-e2e-unconfigured (empty NEXT_PUBLIC_*) → unavailable UI
 * - visual-*: full-page screenshots × viewport × colour scheme (R50)
 * - a11y-*: axe scans × colour scheme (R51)
 * - layout: header rows / overflow / mobile menu across widths × locales
 * - privacy: no third-party requests per route (R52)
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
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      // Long pages (survey) still see ~1–2% AA / composite drift under Chromium.
      maxDiffPixelRatio: 0.02,
    },
  },
  // Omit OS suffix so committed Linux baselines are the single source of truth (R50).
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  use: {
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "configured",
      testMatch: /(?:website-check|survey|benchmark|tools)\/(?!unconfigured).*\.spec\.ts/,
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
    {
      name: "layout",
      testMatch: /layout\/.*\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:8799",
      },
    },
    {
      name: "privacy",
      testMatch: /privacy\/.*\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:8799",
      },
    },
    ...visualProjects(),
    ...a11yProjects(),
  ],
  webServer: [
    {
      command: `npx wrangler pages dev out-e2e --port 8799 --ip 127.0.0.1 --compatibility-date=2026-07-01 --persist-to ${JSON.stringify(WRANGLER_PERSIST_CONFIGURED)}`,
      url: "http://127.0.0.1:8799/en/website-check/",
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: `npx wrangler pages dev out-e2e-unconfigured --port 8798 --ip 127.0.0.1 --compatibility-date=2026-07-01 --persist-to ${JSON.stringify(WRANGLER_PERSIST_UNCONFIGURED)}`,
      url: "http://127.0.0.1:8798/en/website-check/",
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
});
