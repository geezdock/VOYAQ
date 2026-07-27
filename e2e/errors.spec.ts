import { test, expect } from "@playwright/test";

test.describe("Error States", () => {
  test("invalid trip shows error UI", async ({ page }) => {
    await page.goto("/trip/nonexistent");
    await expect(page.locator("text=Trip").or(page.locator("text=Error")).or(page.locator("text=not found"))).toBeVisible();
  });

  test("invalid workspace shows error UI", async ({ page }) => {
    await page.goto("/workspace/nonexistent");
    await expect(page.locator("text=not found").or(page.locator("text=Error"))).toBeVisible();
  });

  test("invalid invite code shows error", async ({ page }) => {
    await page.goto("/join/invalid-code");
    await expect(page.locator("text=Invalid").or(page.locator("text=not found"))).toBeVisible();
  });
});
