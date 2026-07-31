import { test as setup, expect } from "@playwright/test";
import path from "node:path";

const AUTH_FILE = path.join(__dirname, ".auth", "integration-user.json");

setup("sign in with real Supabase", async ({ page }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  expect(
    url && key && !url.includes("placeholder"),
    "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must point at a real Supabase project to run integration tests.",
  ).toBeTruthy();

  await page.goto("/auth");
  await page.getByPlaceholder(/enter your name/i).fill("Integration Tester");
  await page.getByRole("button", { name: /let's go/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
  await page.context().storageState({ path: AUTH_FILE });
});
