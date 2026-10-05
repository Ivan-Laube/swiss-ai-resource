/**
 * Vendor filters: the table and cards are server-rendered and the
 * VendorFilters island shows/hides them by vendor id (R55 TBT fix).
 * Expected counts come from data/vendors.json so the test tracks the data.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";

type Cell<T> = { value: T | null };
type VendorRow = {
  id: string;
  swiss_hosting: Cell<boolean>;
  eu_hosting: Cell<boolean>;
  certifications: Cell<string[]>;
};

const vendorsJson = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "vendors.json"), "utf8"),
) as VendorRow[] | { vendors: VendorRow[] };
const vendors = Array.isArray(vendorsJson) ? vendorsJson : vendorsJson.vendors;
const total = vendors.length;
const swissCount = vendors.filter((v) => v.swiss_hosting.value === true).length;
const euAndFinma = vendors.filter(
  (v) =>
    v.eu_hosting.value === true &&
    (v.certifications.value ?? []).includes("finma_relevant"),
).length;

async function openVendors(page: Page, width: number): Promise<void> {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/de/vendors/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("fieldset[data-hydrated='true']")).toBeVisible();
}

test("desktop table: Swiss hosting filter, count and reset", async ({ page }) => {
  await openVendors(page, 1280);
  const rows = page.locator("tbody tr[data-vendor-id]");
  await expect(rows).toHaveCount(total);
  await expect(page.locator("tbody tr[data-vendor-id]:visible")).toHaveCount(total);

  await page.getByLabel("Schweizer Hosting").check();
  await expect(page.locator("tbody tr[data-vendor-id]:visible")).toHaveCount(
    swissCount,
  );
  await expect(page.getByText(`${swissCount} von ${total} Anbietern`)).toBeVisible();

  await page.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await expect(page.locator("tbody tr[data-vendor-id]:visible")).toHaveCount(total);
});

test("mobile cards follow the same filter", async ({ page }) => {
  await openVendors(page, 375);
  await expect(page.locator("li[data-vendor-id]:visible")).toHaveCount(total);
  await page.getByLabel("Schweizer Hosting").check();
  await expect(page.locator("li[data-vendor-id]:visible")).toHaveCount(swissCount);
});

test("no matches shows the empty message and hides the lists", async ({ page }) => {
  test.skip(euAndFinma > 0, "data now has an EU-hosted FINMA-relevant vendor");
  await openVendors(page, 1280);
  await page.getByLabel("EU-Hosting").check();
  await page.getByLabel("FINMA (Selbstauskunft)").check();
  await expect(
    page.getByText("Keine Anbieter entsprechen den gewählten Filtern."),
  ).toBeVisible();
  await expect(page.locator("#vendor-lists")).toBeHidden();
});
