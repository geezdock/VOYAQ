import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("AI Features in Hub", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/hub");
  });

  test("AI Tips tab exists", async ({ page }) => {
    await expect(page.locator("text=AI Tips")).toBeVisible();
  });

  test("Itinerary tab exists", async ({ page }) => {
    await expect(page.locator("text=Itinerary")).toBeVisible();
  });

  test("AI Budget tab exists", async ({ page }) => {
    await expect(page.locator("text=AI Budget")).toBeVisible();
  });

  test("Alerts tab exists", async ({ page }) => {
    await expect(page.locator("text=Alerts")).toBeVisible();
  });
});
