import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mockSupabaseSession } from "./helpers";

test.describe("Accessibility audit", () => {
  test("homepage has no critical or serious violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("auth page has no critical or serious violations", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("how-it-works page has no critical or serious violations", async ({ page }) => {
    await page.goto("/how-it-works");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("dashboard (authenticated) has no critical or serious violations", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("create squad page has no critical or serious violations", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/create");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("trip view (authenticated) has no critical or serious violations", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/trip/test-squad-1");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("expenses page (authenticated) has no critical or serious violations", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/trip/test-squad-1/expenses");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("destination hub (authenticated) has no critical or serious violations", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/trip/test-squad-1/hub");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });

  test("keyboard navigation: tab through create-squad form shows visible focus", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/create");
    await page.waitForLoadState("networkidle");

    const focusable = page.locator("input, button, [tabindex]:not([tabindex='-1'])");
    const count = await focusable.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();
      const hasOutline = await focused.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.outlineStyle !== "none" && style.outlineWidth !== "0px";
      });
      expect(hasOutline).toBe(true);
    }
  });

  test("all buttons have accessible names on landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).getAttribute("aria-label");
      const text = await buttons.nth(i).textContent();
      const hasName = (name ?? text ?? "").trim().length > 0;
      expect(hasName).toBe(true);
    }
  });

  test("all buttons have accessible names on create page", async ({ page }) => {
    await mockSupabaseSession(page);
    await page.goto("/create");
    await page.waitForLoadState("networkidle");
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).getAttribute("aria-label");
      const text = await buttons.nth(i).textContent();
      const hasName = (name ?? text ?? "").trim().length > 0;
      expect(hasName).toBe(true);
    }
  });
});
