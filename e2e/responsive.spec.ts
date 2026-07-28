import { test, expect } from "@playwright/test";
import { mockSupabaseSession } from "./helpers";

const VIEWPORTS = [
  { width: 320, height: 568, label: "320px — Very small phones" },
  { width: 360, height: 740, label: "360px — Most Android phones" },
  { width: 375, height: 667, label: "375px — Older iPhones" },
  { width: 390, height: 844, label: "390px — Modern iPhones" },
  { width: 412, height: 915, label: "412px — Pixel & larger Android" },
  { width: 430, height: 932, label: "430px — iPhone Pro Max" },
  { width: 768, height: 1024, label: "768px — Foldables & small tablets" },
  { width: 820, height: 1180, label: "820px — iPad" },
  { width: 1024, height: 1366, label: "1024px — Large tablets" },
  { width: 1280, height: 800, label: "1280px — Small laptops" },
  { width: 1440, height: 900, label: "1440px — Desktop" },
  { width: 1920, height: 1080, label: "1920px — Full HD monitors" },
] as const;

test.describe("Responsive viewport matrix", () => {
  for (const vp of VIEWPORTS) {
    test(`homepage fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
      await expect(page.locator("h1").first()).toBeVisible();
    });

    test(`auth page fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/auth");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test(`how-it-works fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/how-it-works");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test(`create squad fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await mockSupabaseSession(page);
      await page.goto("/create");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
      await expect(page.locator("h1").first()).toBeVisible();
    });

    test(`dashboard fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await mockSupabaseSession(page);
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test(`trip view fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await mockSupabaseSession(page);
      await page.goto("/trip/test-squad-1");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test(`expenses fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await mockSupabaseSession(page);
      await page.goto("/trip/test-squad-1/expenses");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test(`destination hub fits at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await mockSupabaseSession(page);
      await page.goto("/trip/test-squad-1/hub");
      await page.waitForLoadState("networkidle");
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(vp.width + 1);
    });
  }
});
