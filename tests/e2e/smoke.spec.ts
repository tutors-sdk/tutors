import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });

  test("homepage has content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
  });

  test("auth page loads", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
  });
});
