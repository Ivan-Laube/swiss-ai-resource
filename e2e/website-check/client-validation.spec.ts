import { test, expect } from "../fixtures/test";
import { copy } from "../fixtures/messages";

const m = copy.en;

const badInputs = [
  { label: "empty", value: "" },
  { label: "whitespace", value: "   " },
  { label: "ftp scheme", value: "ftp://x" },
  { label: "javascript scheme", value: "javascript:alert(1)" },
  { label: "file scheme", value: "file:///etc/passwd" },
  { label: "http without host", value: "http://" },
];

test.describe("client-side URL validation", () => {
  for (const input of badInputs) {
    test(`rejects ${input.label} without calling /scan`, async ({
      websiteCheck,
      page,
    }) => {
      await websiteCheck.gotoWebsiteCheck("en");
      await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();

      const urlInput = page.locator("#website-check-url");
      if (input.value === "") {
        await urlInput.fill("");
      } else {
        await urlInput.fill(input.value);
      }

      const hitsBefore = websiteCheck.scanRequestCount;
      await page.getByRole("button", { name: m.submit }).click();

      await expect(websiteCheck.formAlert()).toHaveText(m.errorBadUrl);
      expect(websiteCheck.scanRequestCount).toBe(hitsBefore);
    });
  }
});
