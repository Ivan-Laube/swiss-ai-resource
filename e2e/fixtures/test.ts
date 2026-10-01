/**
 * Shared Playwright helpers for website-check and survey e2e.
 */
import { test as base, expect, type Page, type Route } from "@playwright/test";
import type { ScanResult } from "../../workers/scanner/src/types";
import { fullReport } from "./scan-results";
import {
  E2E_TURNSTILE_TOKEN,
  TURNSTILE_SCRIPT_URL,
  TURNSTILE_STUB_SOURCE,
  type TurnstileCall,
  type TurnstileMode,
} from "./turnstile-stub";

const SCAN_API = "https://api.aicompliant.ch/scan";
const SUBMIT_API = "https://api.aicompliant.ch/submit";
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

export type ScanHandler = (route: Route) => Promise<void> | void;
export type SubmitHandler = (route: Route) => Promise<void> | void;

type SharedFixtures = {
  turnstileMode: TurnstileMode;
  websiteCheck: WebsiteCheckPage;
  surveyPage: SurveyPage;
};

/** Common network guard + Turnstile stub used by both page helpers. */
abstract class GuardedPage {
  readonly page: Page;
  protected turnstileScriptHits = 0;
  protected blockedUrls: string[] = [];
  protected cspViolations: { blockedURI: string; violatedDirective: string }[] =
    [];
  protected consoleErrors: string[] = [];
  protected turnstileMode: TurnstileMode;
  protected routesInstalled = false;

  constructor(page: Page, turnstileMode: TurnstileMode) {
    this.page = page;
    this.turnstileMode = turnstileMode;
  }

  get turnstileScriptCount(): number {
    return this.turnstileScriptHits;
  }

  get blockedExternalUrls(): string[] {
    return [...this.blockedUrls];
  }

  protected async installCommonRoutes(): Promise<void> {
    if (this.routesInstalled) return;
    this.routesInstalled = true;

    await this.page.addInitScript((mode: TurnstileMode) => {
      window.__turnstileMode = mode;
      window.__cspViolations = [];
      window.__consoleErrors = [];
      document.addEventListener("securitypolicyviolation", (event) => {
        window.__cspViolations?.push({
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
        });
      });
    }, this.turnstileMode);

    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        this.consoleErrors.push(msg.text());
      }
    });
    this.page.on("pageerror", (err) => {
      this.consoleErrors.push(err.message);
    });

    await this.page.route("**/*", async (route) => {
      const reqUrl = route.request().url();
      const url = new URL(reqUrl);
      if (LOCAL_HOSTS.has(url.hostname)) {
        await route.continue();
        return;
      }
      if (
        url.hostname === "api.aicompliant.ch" ||
        url.hostname === "challenges.cloudflare.com"
      ) {
        await route.fallback();
        return;
      }
      this.blockedUrls.push(url.href);
      await route.abort("blockedbyclient");
    });

    await this.page.route(
      "https://challenges.cloudflare.com/turnstile/v0/api.js**",
      async (route) => {
        this.turnstileScriptHits += 1;
        await route.fulfill({
          status: 200,
          contentType: "application/javascript; charset=utf-8",
          body: TURNSTILE_STUB_SOURCE,
        });
      },
    );
  }

  formAlert() {
    return this.page.locator("p[role='alert']");
  }

  async waitForTurnstileRendered(): Promise<void> {
    await expect
      .poll(async () => {
        const calls = await this.turnstileCalls();
        return calls.filter((c) => c.method === "render").length;
      })
      .toBeGreaterThan(0);
  }

  async collectCspViolations(): Promise<
    { blockedURI: string; violatedDirective: string }[]
  > {
    const fromPage = await this.page.evaluate(
      () => window.__cspViolations ?? [],
    );
    this.cspViolations = fromPage;
    return fromPage;
  }

  getConsoleErrors(): string[] {
    return [...this.consoleErrors];
  }

  async turnstileCalls(): Promise<TurnstileCall[]> {
    return this.page.evaluate(() => window.__turnstileCalls ?? []);
  }

  async expireTurnstile(): Promise<void> {
    await this.page.evaluate(() => {
      const id = window.__turnstileActiveId ?? "1";
      window.__turnstileExpire?.(id);
    });
  }

  async issueTurnstileToken(): Promise<void> {
    await this.waitForTurnstileRendered();
    await this.page.evaluate(() => {
      const id = window.__turnstileActiveId ?? "1";
      window.__turnstileIssueToken?.(id);
    });
  }

  async assertNoCspOrConsoleErrors(): Promise<void> {
    const csp = await this.collectCspViolations();
    expect(csp, `CSP violations: ${JSON.stringify(csp)}`).toEqual([]);
    const errors = this.getConsoleErrors().filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("net::ERR_BLOCKED_BY_CLIENT") &&
        !e.includes("Failed to load resource"),
    );
    expect(errors, `Console errors: ${errors.join("\n")}`).toEqual([]);
    expect(
      this.blockedUrls,
      `Unexpected external requests blocked: ${this.blockedUrls.join(", ")}`,
    ).toEqual([]);
  }
}

export class WebsiteCheckPage extends GuardedPage {
  private scanHits = 0;
  private scanHandler: ScanHandler | null = null;

  get scanRequestCount(): number {
    return this.scanHits;
  }

  mockScan(handler: ScanHandler): void {
    this.scanHandler = handler;
  }

  mockScanResult(
    result: ScanResult | { error: string },
    status = 200,
    delayMs = 0,
  ): void {
    this.scanHandler = async (route) => {
      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
      await route.fulfill({
        status,
        contentType: "application/json; charset=utf-8",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(result),
      });
    };
  }

  mockScanAbort(): void {
    this.scanHandler = async (route) => {
      await route.abort("failed");
    };
  }

  async install(): Promise<void> {
    await this.installCommonRoutes();

    await this.page.route("https://api.aicompliant.ch/scan", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
          },
        });
        return;
      }
      this.scanHits += 1;
      if (this.scanHandler) {
        await this.scanHandler(route);
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json; charset=utf-8",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(fullReport()),
      });
    });
  }

  async gotoWebsiteCheck(lang: string = "en"): Promise<void> {
    await this.install();
    await this.page.goto(`/${lang}/website-check/`, {
      waitUntil: "domcontentloaded",
    });
  }
}

export type CapturedSubmit = {
  body: unknown;
  headers: Record<string, string>;
};

export class SurveyPage extends GuardedPage {
  private submitHits = 0;
  private submitHandler: SubmitHandler | null = null;
  private captured: CapturedSubmit[] = [];

  get submitRequestCount(): number {
    return this.submitHits;
  }

  get capturedSubmits(): CapturedSubmit[] {
    return [...this.captured];
  }

  lastCapturedBody(): unknown {
    return this.captured[this.captured.length - 1]?.body;
  }

  mockSubmit(handler: SubmitHandler): void {
    this.submitHandler = handler;
  }

  mockSubmitResult(
    body: unknown,
    status = 201,
    delayMs = 0,
  ): void {
    this.submitHandler = async (route) => {
      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
      await route.fulfill({
        status,
        contentType: "application/json; charset=utf-8",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: status === 204 ? "" : JSON.stringify(body),
      });
    };
  }

  mockSubmitAbort(): void {
    this.submitHandler = async (route) => {
      await route.abort("failed");
    };
  }

  async install(): Promise<void> {
    await this.installCommonRoutes();

    await this.page.route(SUBMIT_API, async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
          },
        });
        return;
      }

      this.submitHits += 1;
      let parsed: unknown = null;
      try {
        parsed = route.request().postDataJSON();
      } catch {
        parsed = route.request().postData();
      }
      this.captured.push({
        body: parsed,
        headers: route.request().headers(),
      });

      if (this.submitHandler) {
        await this.submitHandler(route);
        return;
      }
      await route.fulfill({
        status: 201,
        contentType: "application/json; charset=utf-8",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ ok: true, id: "e2e-response-id" }),
      });
    });
  }

  async gotoSurvey(lang: string = "en"): Promise<void> {
    await this.install();
    await this.page.goto(`/${lang}/survey/`, {
      waitUntil: "domcontentloaded",
    });
  }

  async gotoBenchmark(lang: string = "en"): Promise<void> {
    // Benchmark is static — still install guard so stray requests are caught.
    await this.install();
    await this.page.goto(`/${lang}/benchmark/`, {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Fill every required question with a coherent valid answer set.
   * Clicks labels after Turnstile/hydration so React controlled inputs update.
   */
  async fillValidAnswers(
    overrides: Record<string, string | string[]> = {},
  ): Promise<void> {
    await this.waitForTurnstileRendered();

    const defaults: Record<string, string | string[]> = {
      "company-size": "10-49",
      sector: "ict-software",
      "language-region": "german-speaking",
      "ai-maturity": "piloting-custom",
      "ai-tools": ["chatgpt", "deepl"],
      "primary-use-cases": ["translation"],
      "monthly-spend-chf": "251-1000",
      "spend-outlook-12m": "increase-up-to-50",
      "weekly-ai-users-share": "11-25",
      "hosting-requirement": "switzerland",
      "ai-governance-measures": ["none"],
      "eu-market-exposure": "no-eu",
      "deployment-blockers": ["none"],
      "vendor-decision-factors": ["swiss-entity-support"],
      ...overrides,
    };

    for (const [questionId, value] of Object.entries(defaults)) {
      const values = Array.isArray(value) ? value : [value];
      for (const optionId of values) {
        const input = this.page.locator(
          `input[name="${questionId}"][value="${optionId}"]`,
        );
        await input.scrollIntoViewIfNeeded();
        // Click the label — more reliable for React controlled radios/checkboxes.
        const label = this.page.locator(`label:has(input[name="${questionId}"][value="${optionId}"])`);
        await label.click();
        await expect(input).toBeChecked();
      }
    }
  }

  /** Select a company-size band in the benchmark comparison radios. */
  async selectCompanySize(sizeId: string): Promise<void> {
    await this.page.locator('[data-hydrated="true"]').waitFor({
      state: "attached",
    });
    const input = this.page.locator(
      `section[data-hydrated] input[type="radio"][value="${sizeId}"]`,
    );
    await input.scrollIntoViewIfNeeded();
    await input.click({ force: true });
    await expect(input).toBeChecked();
  }

  async submitForm(): Promise<void> {
    await this.page.locator('button[type="submit"]').click();
  }
}

export const test = base.extend<SharedFixtures>({
  turnstileMode: ["pass", { option: true }],

  websiteCheck: async ({ page, turnstileMode }, use) => {
    const helper = new WebsiteCheckPage(page, turnstileMode);
    await use(helper);
  },

  surveyPage: async ({ page, turnstileMode }, use) => {
    const helper = new SurveyPage(page, turnstileMode);
    await use(helper);
  },
});

export { expect, E2E_TURNSTILE_TOKEN, SCAN_API, SUBMIT_API, TURNSTILE_SCRIPT_URL };
