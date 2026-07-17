import { test, expect } from "@playwright/test";

test.describe("Theme", () => {
  test("dark mode class is applied when set in localStorage", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("modeCurrent", "dark");
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );

    expect(hasDark).toBe(true);
  });
});
