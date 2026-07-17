import { test, expect } from "@playwright/test";
import { interceptCourseRequests } from "./helpers/intercept-course";

test.describe("Lab Navigation", () => {
  test("lab page loads with step content", async ({ page }) => {
    await interceptCourseRequests(page, "test-course");
    await page.goto("/lab/test-course/topic-01/lab-01");
    await page.waitForLoadState("networkidle");

    const content = await page.locator("body").textContent();
    expect(content?.length).toBeGreaterThan(0);
  });
});
