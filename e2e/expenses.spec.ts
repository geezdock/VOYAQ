import { test, expect } from "@playwright/test";
import { mockSupabaseSession, MOCK_SQUAD } from "./helpers";

test.describe("Expenses", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await page.route("**/rest/v1/**", async (route) => {
      const url = route.request().url();
      if (url.includes("squad")) {
        await route.fulfill({ json: [MOCK_SQUAD] });
      } else {
        await route.fulfill({ json: [] });
      }
    });
    await page.goto("/trip/test-squad-1/expenses");
  });

  test("renders expense tracker page", async ({ page }) => {
    await expect(page.locator("text=Expenses")).toBeVisible();
  });

  test("has add expense form", async ({ page }) => {
    await expect(page.locator("text=Add Expense").or(page.locator("text=Description"))).toBeVisible();
  });

  test("back button navigates to trip", async ({ page }) => {
    await page.getByRole("button", { name: /back/i }).first().click();
    await expect(page).toHaveURL(/\/trip\/test-squad-1$/);
  });
});
