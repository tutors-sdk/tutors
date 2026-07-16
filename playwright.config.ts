import { defineConfig, devices } from "@playwright/test";

const e2eEnv = {
  PUBLIC_ANON_MODE: "TRUE",
  PUBLIC_SUPABASE_URL: "https://test.supabase.co",
  PUBLIC_SUPABASE_ANON_KEY: "test-key",
  PUBLIC_party_kit_main_room: "localhost:1999",
  PUBLIC_PDF_KEY: "test-key",
  PRIVATE_AUTH_GITHUB_SECRET: "test-github-secret",
  PRIVATE_AUTH_GITHUB_ID: "test-github-id",
  PRIVATE_AUTH_SECRET: "test-auth-secret-at-least-32-chars-long"
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }]
  ],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "smoke",
      testMatch: "smoke.spec.ts",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    env: e2eEnv
  }
});
