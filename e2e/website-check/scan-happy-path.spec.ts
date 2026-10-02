import { test, expect, E2E_TURNSTILE_TOKEN, SCAN_API } from "../fixtures/test";
import { copy } from "../fixtures/messages";
import { guideTitle } from "../fixtures/content";
import {
  checkMeta,
  dynamicSite,
  fullReport,
  redirectedReport,
  withFinding,
} from "../fixtures/scan-results";

test.describe("scan happy path", () => {
  test("normalizes bare host, shows scanning state, renders report", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    let capturedBody: unknown = null;
    let capturedContentType: string | null = null;

    websiteCheck.mockScan(async (route) => {
      capturedContentType = route.request().headers()["content-type"] ?? null;
      capturedBody = route.request().postDataJSON();
      // Delay so the UI can paint "Scanning …"
      await new Promise((r) => setTimeout(r, 400));
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

    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();

    await page.locator("#website-check-url").fill("example.ch");
    const scanPromise = page.waitForRequest(
      (req) => req.url() === SCAN_API && req.method() === "POST",
    );
    await page.getByRole("button", { name: m.submit }).click();

    await expect(page.getByRole("button", { name: m.scanning })).toBeVisible();
    await expect(page.locator("#website-check-url")).toBeDisabled();

    await scanPromise;
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();

    expect(capturedContentType).toMatch(/application\/json/);
    expect(capturedBody).toEqual({
      url: "https://example.ch/",
      turnstile_token: E2E_TURNSTILE_TOKEN,
    });

    await expect(page.getByText(m.scannedUrl, { exact: true })).toBeVisible();
    await expect(page.getByText("https://example.ch/", { exact: true })).toBeVisible();
    // Same finalUrl → no "Final URL" row
    await expect(page.getByText(m.finalUrl, { exact: true })).toHaveCount(0);

    // Severity order: High, Medium, Low, Info — empty buckets omitted.
    // fullReport has high (privacy + trackers), medium (impressum), low (cookie), info (https, headers, honesty).
    const headings = page.locator(".severityTitle, h2");
    // Use role headings inside the report
    const report = page.locator('[aria-live="polite"]');
    const severityHeadings = report.getByRole("heading", { level: 2 });
    await expect(severityHeadings).toHaveText([
      m.severityHigh,
      m.severityMedium,
      m.severityLow,
      m.severityInfo,
    ]);

    await expect(page.getByText(m.disclaimer, { exact: true })).toBeVisible();
    // No static-scan caveat when incomplete is false
    await expect(
      page.getByText(m.staticScanCaveat, { exact: true }),
    ).toHaveCount(0);

    void headings;
    await websiteCheck.assertNoCspOrConsoleErrors();
  });

  test("shows Final URL when it differs from scanned URL", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    websiteCheck.mockScanResult(redirectedReport());
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.locator("#website-check-url").fill("https://example.ch/");
    await page.getByRole("button", { name: m.submit }).click();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
    await expect(page.getByText(m.finalUrl, { exact: true })).toBeVisible();
    await expect(
      page.getByText("https://www.example.ch/", { exact: true }),
    ).toBeVisible();
  });

  test("shows static-scan caveat when incomplete", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    websiteCheck.mockScanResult(dynamicSite());
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.locator("#website-check-url").fill("https://example.ch/");
    await page.getByRole("button", { name: m.submit }).click();
    await expect(
      page.getByText(m.staticScanCaveat, { exact: true }),
    ).toBeVisible();
  });

  for (const lang of ["de", "fr"] as const) {
    test(`localizes finding titles and statuses (${lang})`, async ({
      websiteCheck,
      page,
    }) => {
      const m = copy[lang];
      const privacy = checkMeta("privacy-policy-link");
      const impressum = checkMeta("impressum");
      const https = checkMeta("https");

      const result = fullReport({
        findings: [
          {
            ...privacy,
            status: "found",
            evidence: {
              matched_text: "Datenschutz",
              matched_href: "https://example.ch/datenschutz",
              locale: "de",
              verify_status: "ok",
            },
          },
          {
            ...impressum,
            status: "not_found",
            evidence: {
              matched_text: null,
              matched_href: null,
              locale: null,
              verify_status: null,
            },
          },
          {
            ...https,
            status: "indeterminate",
            evidence: {
              https: true,
              http_redirects_to_https: null,
            },
          },
        ],
      });

      websiteCheck.mockScanResult(result);
      await websiteCheck.gotoWebsiteCheck(lang);
      await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
      await page.locator("#website-check-url").fill("https://example.ch/");
      await page.getByRole("button", { name: m.submit }).click();
      await expect(page.locator('[aria-live="polite"]')).toBeVisible();

      await expect(
        page.getByRole("heading", {
          level: 3,
          name: privacy.title[lang],
        }),
      ).toBeVisible();
      await expect(
        page.getByText(privacy.description[lang], { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(m.statusFound, { exact: true }).first()).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 3,
          name: impressum.title[lang],
        }),
      ).toBeVisible();
      await expect(page.getByText(m.statusNotFound, { exact: true }).first()).toBeVisible();
      await expect(
        page.getByText(m.statusIndeterminate, { exact: true }).first(),
      ).toBeVisible();

      // HTTPS evidence with null redirect → Indeterminate label
      await expect(
        page.getByText(`HTTP → HTTPS: ${m.statusIndeterminate}`, {
          exact: true,
        }),
      ).toBeVisible();
    });
  }

  test("renders legal basis, related page, and evidence lines", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    const privacy = checkMeta("privacy-policy-link");
    const headers = checkMeta("security-headers");
    const trackers = checkMeta("third-party-trackers");

    const result = fullReport({
      findings: [
        {
          ...privacy,
          status: "found",
          evidence: {
            matched_text: "Privacy Policy",
            matched_href: "https://example.ch/privacy",
            locale: "en",
            verify_status: "ok",
          },
        },
        {
          ...trackers,
          status: "found",
          evidence: {
            matched_signatures: [
              { id: "google-analytics", label: "Google Analytics (GA4 / gtag)" },
            ],
          },
        },
        {
          ...headers,
          status: "not_found",
          evidence: {
            headers: [
              {
                id: "hsts",
                name: "strict-transport-security",
                present: true,
                value: "max-age=1",
              },
              {
                id: "csp",
                name: "content-security-policy",
                present: false,
                value: null,
              },
              {
                id: "x-content-type-options",
                name: "x-content-type-options",
                present: false,
                value: null,
              },
            ],
          },
        },
        {
          ...checkMeta("https"),
          status: "found",
          evidence: { https: true, http_redirects_to_https: true },
        },
      ],
    });

    websiteCheck.mockScanResult(result);
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.locator("#website-check-url").fill("https://example.ch/");
    await page.getByRole("button", { name: m.submit }).click();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();

    const legalLink = page.getByRole("link", {
      name: privacy.legal_basis.reference,
    });
    await expect(legalLink).toHaveAttribute("href", privacy.legal_basis.url);
    await expect(legalLink).toHaveAttribute("target", "_blank");
    await expect(legalLink).toHaveAttribute("rel", "noopener noreferrer");

    // Related guide links show the localized page title (and section, if
    // the ref has an anchor) and point at the page or one of its sections.
    const related = page
      .getByRole("link", { name: guideTitle("en", "ndsg-ai-basics") })
      .first();
    await expect(related).toHaveAttribute(
      "href",
      /^\/en\/ndsg-ai-basics\/(#[a-z][a-z0-9-]*)?$/,
    );

    // Related page exists in the static export
    const relatedStatus = await page.request.get("/en/ndsg-ai-basics/");
    expect(relatedStatus.status()).toBe(200);

    await expect(
      page.getByText(`HTTPS: ${m.statusFound}`, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(`HTTP → HTTPS: ${m.statusFound}`, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Privacy Policy", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("https://example.ch/privacy", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("HEAD: ok", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Google Analytics (GA4 / gtag)", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(`strict-transport-security: ${m.statusFound}`, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(`content-security-policy: ${m.statusNotFound}`, {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("omits empty severity groups", async ({ websiteCheck, page }) => {
    const m = copy.en;
    // Only info-severity findings
    const result = withFinding("https", {
      status: "found",
      evidence: { https: true, http_redirects_to_https: false },
    });
    result.findings = result.findings.filter((f) => f.severity === "info");

    websiteCheck.mockScanResult(result);
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.locator("#website-check-url").fill("https://example.ch/");
    await page.getByRole("button", { name: m.submit }).click();
    const report = page.locator('[aria-live="polite"]');
    await expect(report).toBeVisible();
    await expect(
      report.getByRole("heading", { level: 2, name: m.severityHigh }),
    ).toHaveCount(0);
    await expect(
      report.getByRole("heading", { level: 2, name: m.severityInfo }),
    ).toBeVisible();
  });
});
