/**
 * R52: record network hosts per route; only same-origin (plus Turnstile/API
 * on website-check and survey) is allowed.
 *
 * Also asserts zero CSP violations per route: pages load under their real
 * per-page meta CSP (scripts/csp-hashes.ts), so a missing hash or a new
 * third-party script fails here, not only in production.
 */
import { test, expect, type Page } from "@playwright/test";
import {
  TURNSTILE_SCRIPT_URL,
  TURNSTILE_STUB_SOURCE,
} from "../fixtures/turnstile-stub";
import {
  listVisualRoutes,
  needsTurnstile,
  visualPath,
  VISUAL_LOCALES,
} from "../visual/routes";
import {
  allowedHosts,
  hostFromRequestUrl,
  unexpectedHosts,
} from "./network";

async function stubTurnstile(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.__turnstileMode = "pass";
  });
  await page.route(`${TURNSTILE_SCRIPT_URL}**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: TURNSTILE_STUB_SOURCE,
    });
  });
}

async function settlePage(
  page: Page,
  options: { waitForTurnstile?: boolean },
): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main")).toBeVisible();

  if (options.waitForTurnstile) {
    await expect
      .poll(async () => {
        const calls = await page.evaluate(() => window.__turnstileCalls ?? []);
        return calls.filter((c) => c.method === "render").length;
      })
      .toBeGreaterThan(0);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
}

for (const LANG of VISUAL_LOCALES) {
  test.describe(`no third-party requests (${LANG})`, () => {
    /** Includes 404 via VISUAL_404_ROUTE in listVisualRoutes. */
    const routes = listVisualRoutes(LANG);

    for (const route of routes) {
      test(`${route.id}`, async ({ page, baseURL }) => {
        const seen = new Set<string>();
        const cspViolations: string[] = [];
        page.on("console", (message) => {
          if (/Content[- ]Security[- ]Policy/i.test(message.text())) {
            cspViolations.push(message.text());
          }
        });
        await page.addInitScript(() => {
          document.addEventListener("securitypolicyviolation", (event) => {
            const w = window as unknown as { __cspViolations?: string[] };
            (w.__cspViolations ??= []).push(
              `${event.violatedDirective} blocked ${event.blockedURI || "inline"}`,
            );
          });
        });
        page.on("request", (req) => {
          const host = hostFromRequestUrl(req.url());
          if (host) {
            seen.add(host);
          }
        });

        await stubTurnstile(page);

        const path = visualPath(LANG, route);
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await settlePage(page, { waitForTurnstile: needsTurnstile(route) });

        const originHost = new URL(baseURL ?? page.url()).hostname;
        const allowed = allowedHosts(originHost, needsTurnstile(route));
        const unexpected = unexpectedHosts(seen, allowed);

        expect(
          unexpected,
          `Unexpected third-party host(s) on ${path}: ${unexpected.join(", ")}`,
        ).toEqual([]);

        const domViolations = await page.evaluate(
          () =>
            (window as unknown as { __cspViolations?: string[] })
              .__cspViolations ?? [],
        );
        expect(
          [...domViolations, ...cspViolations],
          `CSP violations on ${path}`,
        ).toEqual([]);
      });
    }
  });
}
