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
});
