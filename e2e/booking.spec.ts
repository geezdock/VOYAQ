import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Booking Integrations", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/hub");
  });

  test("Book Travel tab is present in hub", async ({ page }) => {
    await expect(page.locator("text=Book Travel")).toBeVisible();
  });

  test("Book Travel tab shows IRCTC, RedBus, Skyscanner", async ({ page }) => {
    await page.locator("text=Book Travel").first().click();
    await expect(page.getByRole("heading", { name: "IRCTC" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "RedBus" })).toBeVisible();
  });

  test("Stay tab shows hostel/hotel options", async ({ page }) => {
    await page.locator("text=Stay").first().click();
    await expect(page.getByRole("heading", { name: "Zostel" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Hosteller" })).toBeVisible();
  });
});
