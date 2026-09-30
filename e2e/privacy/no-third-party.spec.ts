/**
 * R52: record network hosts per route; only same-origin (plus Turnstile/API
 * on website-check and survey) is allowed.
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
  type VisualRoute,
} from "../visual/routes";
import {
  allowedHosts,
  hostFromRequestUrl,
  unexpectedHosts,
} from "./network";

/** Unknown path → global 404.html (not in the sitemap-derived route list). */
const NOT_FOUND_ROUTE: VisualRoute = {
  id: "404",
  segment: "__privacy-missing__",
};

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
    const routes = [...listVisualRoutes(LANG), NOT_FOUND_ROUTE];

    for (const route of routes) {
      test(`${route.id}`, async ({ page, baseURL }) => {
        const seen = new Set<string>();
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
      });
    }
  });
}
