import { test, expect } from "@playwright/test";
import { interceptCourseRequests } from "./helpers/intercept-course";

test.describe("Course Reader", () => {
  test.beforeEach(async ({ page }) => {
    await interceptCourseRequests(page);
  });

  test("loads and displays course title", async ({ page }) => {
    await page.goto("/course/test-course");
    await expect(page.getByRole("heading", { name: "Test Course" })).toBeVisible({ timeout: 15000 });
  });

  test("displays topic cards", async ({ page }) => {
    await page.goto("/course/test-course");
    await expect(page.locator("text=Topic 1").first()).toBeVisible({ timeout: 15000 });
  });

  test("navigates from course to topic", async ({ page }) => {
    await page.goto("/course/test-course");
    await page.locator("text=Topic 1").first().click();
    await expect(page).toHaveURL(/\/topic\/test-course/);
  });
});
