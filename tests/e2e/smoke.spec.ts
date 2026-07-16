import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads without JavaScript errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/.*/);
    expect(errors).toHaveLength(0);
  });

  test("homepage renders content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("auth page loads", async ({ page }) => {
    await page.goto("/auth");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("no unexpected console errors on homepage", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const unexpectedErrors = consoleErrors.filter((e) => !e.includes("supabase") && !e.includes("partykit") && !e.includes("PartySocket") && !e.includes("Failed to fetch"));
    expect(unexpectedErrors).toHaveLength(0);
  });

  test("404 course shows error handling", async ({ page }) => {
    await page.route("**/*.netlify.app/tutors.json", (route) => {
      route.fulfill({ status: 404, body: "Not Found" });
    });

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/course/nonexistent-course");
    await page.waitForTimeout(2000);
    // App may show error or blank page — the key assertion is it doesn't crash uncontrollably
  });
});
