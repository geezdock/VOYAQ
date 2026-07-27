import { test, expect } from "@playwright/test";

test.describe("VOYAQ smoke tests", () => {
  test("homepage loads and shows the main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("destination catalog loads at /destinations", async ({ page }) => {
    await page.goto("/destinations");
    await expect(page).toHaveTitle(/Destinations|VOYAQ/);
  });

  test("destination hub loads for a known destination", async ({ page }) => {
    await page.goto("/destinations/goa");
    await expect(page.locator("text=Overview").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigation between hub tabs works", async ({ page }) => {
    await page.goto("/destinations/manali");
    await page.locator("text=Weather").first().click();
    await expect(page.locator("text=Weather").first()).toBeVisible();
  });
});
