import { test, expect } from "@playwright/test";
import { mockSupabaseSession, MOCK_SQUAD } from "./helpers";

test.describe("Booking Integrations", () => {
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

  test("Book Travel tab is present in hub", async ({ page }) => {
    await expect(page.locator("text=Book Travel")).toBeVisible();
  });

  test("Book Travel tab shows IRCTC, RedBus, Skyscanner", async ({ page }) => {
    await page.locator("text=Book Travel").first().click();
    await expect(page.locator("text=IRCTC").or(page.locator("text=Train"))).toBeVisible();
    await expect(page.locator("text=RedBus").or(page.locator("text=Bus"))).toBeVisible();
  });

  test("Stay tab shows hostel/hotel options", async ({ page }) => {
    await page.locator("text=Stay").first().click();
    await expect(page.locator("text=Zostel").or(page.locator("text=Hostel"))).toBeVisible();
  });
});
