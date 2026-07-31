import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("VOYAQ smoke tests", () => {
  test("homepage loads and shows the main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("workspace loads for a seeded squad", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/workspace/test-squad-1");
    await expect(page.locator("text=Goa Crew")).toBeVisible();
  });

  test("destination hub loads for a known destination", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/hub");
    await expect(page.locator("text=Overview").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigation between hub tabs works", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/hub");
    await page.locator("text=Weather").first().click();
    await expect(page.locator("text=Weather").first()).toBeVisible();
  });
});
