import { test, expect } from "@playwright/test";
import { mockSupabaseSession, stripNextDevTools } from "./helpers";

test.describe("Create Squad flow", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await stripNextDevTools(page);
  });

  test("create page has 5-step wizard", async ({ page }) => {
    await page.goto("/create");
    await expect(page.locator("text=Squad Name")).toBeVisible();
    await expect(page.getByPlaceholder(/Goa Crew/i)).toBeVisible();
  });

  test("name step requires squad name", async ({ page }) => {
    await page.goto("/create");
    await page.getByRole("button", { name: /next.*members/i }).click();
    await expect(page.locator("text=Enter a squad name")).toBeVisible();
    await expect(page.getByText("Squad Name", { exact: true })).toBeVisible();
  });

  test("wizard completes through all 5 steps", async ({ page }) => {
    await page.goto("/create");

    await page.getByPlaceholder(/Goa Crew/i).fill("Test Squad");
    await page.getByRole("button", { name: /next.*members/i }).click();
    await expect(page.locator("text=Set Member Limit")).toBeVisible();

    await page.getByRole("button", { name: /next.*budget/i }).click();
    await expect(page.locator("text=Set a Budget")).toBeVisible();

    await page.getByRole("button", { name: /next.*dates/i }).click();
    await expect(page.locator("text=Pick Dates")).toBeVisible();

    await page.locator("input[type=date]").nth(0).fill("2026-08-15");
    await page.locator("input[type=date]").nth(1).fill("2026-08-18");
    await page.getByRole("button", { name: /review/i }).click();
    await expect(page.locator("text=Ready to Launch")).toBeVisible();
  });
});
