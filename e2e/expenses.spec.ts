import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Expenses", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/expenses");
  });

  test("renders expense tracker page", async ({ page }) => {
    await expect(page.locator("text=Expenses").first()).toBeVisible();
  });

  test("has add expense form", async ({ page }) => {
    await expect(page.locator("text=Add Expense").first()).toBeVisible();
  });

  test("back button navigates to trip", async ({ page }) => {
    await page.getByRole("button", { name: /trip/i }).first().click();
    await expect(page).toHaveURL(/\/trip\/test-squad-1$/);
  });
});
