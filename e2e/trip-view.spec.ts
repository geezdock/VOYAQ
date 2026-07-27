import { test, expect } from "@playwright/test";
import { mockSupabaseSession, MOCK_SQUAD } from "./helpers";

test.describe("Trip View", () => {
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
    await page.goto("/trip/test-squad-1");
  });

  test("renders trip details", async ({ page }) => {
    await expect(page.locator(`text=${MOCK_SQUAD.name}`).first()).toBeVisible();
  });

  test("shows destination hub button", async ({ page }) => {
    await expect(page.locator("text=Destination Hub").or(page.locator("text=Hub"))).toBeVisible();
  });

  test("shows expenses button", async ({ page }) => {
    await expect(page.locator("text=Expenses")).toBeVisible();
  });

  test("destination hub link navigates to hub", async ({ page }) => {
    await page.locator("text=Destination Hub").first().click();
    await expect(page).toHaveURL(/\/trip\/test-squad-1\/hub/);
  });

  test("expenses link navigates to expenses", async ({ page }) => {
    await page.locator("text=Expenses").first().click();
    await expect(page).toHaveURL(/\/trip\/test-squad-1\/expenses/);
  });

  test("share button is present", async ({ page }) => {
    await expect(page.locator('button[title="Share"]').first()).toBeVisible();
  });
});
