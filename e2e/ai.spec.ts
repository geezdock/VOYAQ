import { test, expect } from "@playwright/test";
import { mockSupabaseSession, MOCK_SQUAD } from "./helpers";

test.describe("AI Features in Hub", () => {
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
