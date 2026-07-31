import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const AUTH_FILE = path.join(__dirname, "e2e", ".auth", "integration-user.json");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "auth-setup",
      testMatch: /test-auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "integration",
      testMatch: /integration\/.*\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: AUTH_FILE,
      },
    },
  ],
});
