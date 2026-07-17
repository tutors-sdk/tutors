import { test, expect } from "@playwright/test";
import { interceptCourseRequests } from "./helpers/intercept-course";

test.describe("Course Reader", () => {
  test("loads a course and displays the title", async ({ page }) => {
    await interceptCourseRequests(page, "test-course");
    await page.goto("/course/test-course");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Test Course" })).toBeVisible({ timeout: 10000 });
  });

  test("displays topic cards for the course", async ({ page }) => {
    await interceptCourseRequests(page, "test-course");
    await page.goto("/course/test-course");
    await page.waitForLoadState("networkidle");

    const topicText = page.getByText("Topic 1");
    await expect(topicText.first()).toBeVisible({ timeout: 10000 });
  });
});
