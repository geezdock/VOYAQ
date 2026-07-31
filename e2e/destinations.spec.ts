import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Destinations in Workspace", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/workspace/test-squad-1");
  });

  test("destinations tab shows destination options", async ({ page }) => {
    await page.locator("text=Destinations").click();
    await expect(page.locator("text=Goa").first()).toBeVisible();
    await expect(page.locator("text=Manali").first()).toBeVisible();
  });

  test("destinations tab shows votes for destinations", async ({ page }) => {
    await page.locator("text=Destinations").click();
    await expect(page.locator("text=Goa").first()).toBeVisible();
  });
});
