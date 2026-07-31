import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Workspace", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/workspace/test-squad-1");
  });

  test("renders squad tab by default", async ({ page }) => {
    await expect(page.locator("text=Squad").first()).toBeVisible();
    await expect(page.locator("text=Goa Crew")).toBeVisible();
  });

  test("navigates between all 5 tabs", async ({ page }) => {
    await page.getByRole("button", { name: /stay in workspace/i }).click();

    await page.locator("text=Destinations").click();
    await expect(page.locator("text=Destinations").first()).toBeVisible();

    await page.locator("text=Dates").first().click();
    await expect(page.locator("text=Dates").first()).toBeVisible();

    await page.locator("text=Budget").first().click();
    await expect(page.locator("text=Budget").first()).toBeVisible();

    await page.locator("text=Polls").first().click();
    await expect(page.locator("text=Polls").first()).toBeVisible();
  });

  test("shows invite code in squad tab", async ({ page }) => {
    await expect(page.locator(`text=${"goa-trip-abc"}`)).toBeVisible();
  });

  test("shows trip ready button when all locked", async ({ page }) => {
    await expect(page.locator("text=Trip Ready")).toBeVisible();
  });
});
