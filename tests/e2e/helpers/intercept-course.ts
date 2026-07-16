import type { Page } from "@playwright/test";
import mockCourse from "../fixtures/mock-course.json" with { type: "json" };

export async function interceptCourseRequests(page: Page, courseId = "test-course") {
  await page.route(`**/${courseId}.netlify.app/tutors.json`, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockCourse)
    });
  });

  await page.route(`**/${courseId}.netlify.app/img/**`, (route) => {
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64")
    });
  });

  await page.route("**/*.supabase.co/**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [], error: null })
    });
  });

  await page.route("**/partykit/**", (route) => {
    route.abort();
  });
}

export async function interceptCatalogue(page: Page) {
  await page.route("**/*.supabase.co/**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [], count: 0 })
    });
  });
}
