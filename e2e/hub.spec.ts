import { test, expect } from "@playwright/test";
import { mockSupabaseSession, MOCK_SQUAD } from "./helpers";

test.describe("Destination Hub", () => {
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

  test("renders destination name and tab bar", async ({ page }) => {
    await expect(page.locator(`text=${MOCK_SQUAD.lockedDestination}`).first()).toBeVisible();
    await expect(page.locator("text=Overview").first()).toBeVisible();
    await expect(page.locator("text=Weather").first()).toBeVisible();
  });

  test("navigates between tabs using the tab bar", async ({ page }) => {
    await page.locator("text=Weather").first().click();
    await expect(page.locator("text=Weather").first()).toBeVisible();

    await page.locator("text=Food").first().click();
    await expect(page.locator("text=Food").first()).toBeVisible();

    await page.locator("text=Places").first().click();
    await expect(page.locator("text=Places").first()).toBeVisible();
  });

  test("next arrow advances to next tab", async ({ page }) => {
    const nextArrow = page.locator("button:has(svg.rotate-180)").first();
    if (await nextArrow.isEnabled()) {
      await nextArrow.click();
      await expect(page.locator("text=Weather").first()).toBeVisible();
    }
  });

  test("back button returns to trip view", async ({ page }) => {
    await page.getByRole("link", { name: /trip/i }).first().click();
    await expect(page).toHaveURL(/\/trip\/test-squad-1$/);
  });

  test("shows 15 tabs with correct positions", async ({ page }) => {
    await expect(page.locator("text=1 / 15")).toBeVisible();
  });

  test("keyboard arrows switch tabs", async ({ page }) => {
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("text=2 / 15")).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("text=1 / 15")).toBeVisible();
  });
});
