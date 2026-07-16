import { test, expect } from "@playwright/test";

test.describe("Theme", () => {
  test("persists dark mode preference", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("modeCurrent", "dark"));
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("persists theme preference", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "classic"));
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
  });
});
