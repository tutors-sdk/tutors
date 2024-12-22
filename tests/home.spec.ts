import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    // Basic assertions to verify the page loaded
    await expect(page).toHaveTitle(/Tutors/);

    // Wait for the main content to be visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/course/tutors-starter-course");

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Test navigation elements are present
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });
});
