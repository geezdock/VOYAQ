import { test, expect } from "@playwright/test";

test.describe("Destinations Catalog", () => {
  test("catalog page loads with heading", async ({ page }) => {
    await page.goto("/destinations");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("individual destination page loads", async ({ page }) => {
    await page.goto("/destinations/goa");
    await expect(page.locator("text=Goa").first()).toBeVisible();
  });
});
