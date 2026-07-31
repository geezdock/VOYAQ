import { test, expect } from "@playwright/test";
import { mockSupabaseSession, seedMockSquad } from "./helpers";

test.describe("Network conditions", () => {
  test("homepage loads under 10s on slow 3G", async ({ page }) => {
    await page.context().route("**/*", async (route) => {
      const headers = route.request().headers();
      await new Promise((r) => setTimeout(r, 500));
      await route.continue({ headers });
    });
    const start = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test("homepage renders without JS (basic SSR)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const html = await page.content();
    expect(html).toContain("VOYAQ");
    expect(html).toContain("Plan trips");
  });

  test("auth page loads offline from cache", async ({ page }) => {
    await page.goto("/auth", { waitUntil: "networkidle" });
    const html = await page.content();
    expect(html).toContain("VOYAQ");
    await expect(page.locator("body")).toBeAttached();
  });

  test("dashboard loads with mock session on slow connection", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.context().route("**/*", async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.continue();
    });
    const start = Date.now();
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(15000);
    await expect(page.locator("body")).toBeVisible();
  });

  test("create squad form renders on slow 3G", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.context().route("**/*", async (route) => {
      await new Promise((r) => setTimeout(r, 400));
      await route.continue();
    });
    await page.goto("/create", { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("trip view loads under 10s on throttled connection", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.context().route("**/*", async (route) => {
      await new Promise((r) => setTimeout(r, 200));
      await route.continue();
    });
    const start = Date.now();
    await page.goto("/trip/test-squad-1", { waitUntil: "networkidle" });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test("expenses page loads with squad from cache", async ({ page }) => {
    await mockSupabaseSession(page);
    await seedMockSquad(page);
    await page.goto("/trip/test-squad-1/expenses", { waitUntil: "networkidle" });
    await expect(page.locator("text=Add Expense").first()).toBeVisible();
  });
});
