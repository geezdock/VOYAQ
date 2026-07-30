import { chromium } from "playwright";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "screenshots");

const BASE_URL = "http://localhost:3000";

const pages = [
  { path: "/", name: "landing" },
  { path: "/dashboard", name: "dashboard" },
  { path: "/toolkit", name: "toolkit" },
  { path: "/workspace/squad-demo-1", name: "workspace" },
  { path: "/trip/squad-demo-1/hub", name: "destination-hub" },
  { path: "/toolkit/packing", name: "packing-list" },
  { path: "/toolkit/currency-converter", name: "currency-converter" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  const fs = await import("fs");
  fs.mkdirSync(outDir, { recursive: true });

  // Authenticate in DEV_AUTH mode: type a name and go to dashboard
  const authPage = await context.newPage();
  await authPage.goto(`${BASE_URL}/auth`, { waitUntil: "networkidle", timeout: 30000 });
  await authPage.waitForTimeout(500);
  const nameInput = authPage.locator("input[placeholder='Enter your name']");
  if (await nameInput.isVisible({ timeout: 3000 })) {
    await nameInput.fill("Demo User");
    await authPage.locator("button[type=submit]").click();
    await authPage.waitForURL("**/dashboard", { timeout: 15000 });
  }
  await authPage.close();

  for (const { path, name } of pages) {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false });
      console.log(`✓ ${name}`);
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log(`\nScreenshots saved to public/screenshots/`);
}

main().catch(console.error);
