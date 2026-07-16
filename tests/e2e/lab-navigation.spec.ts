import { test, expect } from "@playwright/test";
import { interceptCourseRequests } from "./helpers/intercept-course";

test.describe("Lab Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await interceptCourseRequests(page);
  });

  test("lab page loads with content", async ({ page }) => {
    await page.goto("/lab/test-course/topic-01/lab-01/Step01");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
