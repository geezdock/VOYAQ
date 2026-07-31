import { test, expect } from "@playwright/test";
import { getAccessToken, deleteSquad } from "./helpers";

test.describe("Squad persistence (real Supabase)", () => {
  const squadName = `Integration Squad ${Date.now()}`;
  let squadId: string;

  test.afterAll(async () => {
    if (squadId) {
      await deleteSquad(squadId, getAccessToken()).catch(() => {});
    }
  });

  test("creates a squad through the wizard and persists it to Supabase", async ({ page }) => {
    await page.goto("/create");
    await page.getByPlaceholder(/Goa Crew/i).fill(squadName);
    await page.getByRole("button", { name: /next.*members/i }).click();
    await page.getByRole("button", { name: /next.*budget/i }).click();
    await page.getByRole("button", { name: /next.*dates/i }).click();
    await page.locator("input[type=date]").nth(0).fill("2026-08-15");
    await page.locator("input[type=date]").nth(1).fill("2026-08-18");
    await page.getByRole("button", { name: /review/i }).click();
    await page.getByRole("button", { name: /launch squad/i }).click();

    await page.waitForURL(/\/workspace\/[^/]+$/, { timeout: 30_000 });
    squadId = new URL(page.url()).pathname.split("/").pop() ?? "";

    await expect(page.locator(`text=${squadName}`).first()).toBeVisible();
  });
});
