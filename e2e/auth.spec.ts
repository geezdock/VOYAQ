import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("homepage shows get started CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /start a squad/i }).first()).toBeVisible();
  });

  test("get started leads to auth page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /start a squad/i }).first().click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test("auth page has name input and submit", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByPlaceholder(/enter your name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /let's go/i })).toBeVisible();
  });
});
