import { test, expect } from "@playwright/test";
import { mockSupabaseSession } from "./helpers";

test.describe("Create Squad flow", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
  });

  test("create page has 5-step wizard", async ({ page }) => {
    await page.goto("/create");
    await expect(page.locator("text=Squad Name")).toBeVisible();
    await expect(page.getByPlaceholder(/Goa Crew/i)).toBeVisible();
  });

  test("name step requires squad name", async ({ page }) => {
    await page.goto("/create");
    await page.getByRole("button", { name: /next/i }).click();
    await expect(page.locator("text=Squad Name")).toBeVisible();
  });

  test("wizard completes through all 5 steps", async ({ page }) => {
    await page.goto("/create");

    await page.getByPlaceholder(/Goa Crew/i).fill("Test Squad");
    await page.getByRole("button", { name: /next.*member/i }).click();
    await expect(page.locator("text=Members")).toBeVisible();

    await page.getByRole("button", { name: /next.*budget/i }).click();
    await expect(page.locator("text=Budget")).toBeVisible();

    await page.getByRole("button", { name: /next.*dates/i }).click();
    await expect(page.locator("text=Dates")).toBeVisible();

    await page.getByRole("button", { name: /review/i }).click();
    await expect(page.locator("text=Review")).toBeVisible();
  });
});
