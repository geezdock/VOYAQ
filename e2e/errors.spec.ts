import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Error States", () => {
  test("invalid trip redirects to dashboard", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/nonexistent");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("invalid workspace redirects to dashboard", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/workspace/nonexistent");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("invalid invite code shows error", async ({ page }) => {
    await page.goto("/join/invalid-code");
    await expect(page.locator("text=Invalid Invite Code")).toBeVisible();
  });
});
