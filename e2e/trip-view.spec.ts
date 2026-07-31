import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Trip View", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1");
  });

  test("renders trip details", async ({ page }) => {
    await expect(page.locator("text=Goa Crew").first()).toBeVisible();
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
