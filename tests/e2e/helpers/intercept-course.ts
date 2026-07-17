import { type Page } from "@playwright/test";
import mockCourse from "../fixtures/mock-course.json" with { type: "json" };

export function injectCourseUrl(obj: unknown, courseUrl: string): unknown {
  const json = JSON.stringify(obj);
  return JSON.parse(json.replaceAll("{{COURSEURL}}", courseUrl));
}

export async function interceptCourseRequests(page: Page, courseId: string) {
  const courseUrl = `${courseId}.netlify.app`;
  const courseData = injectCourseUrl(mockCourse, courseUrl);

  await page.route(`**/${courseUrl}/tutors.json`, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(courseData) })
  );

  await page.route(`**/${courseUrl}/img/**`, (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from([]) })
  );

  await page.route("**/*.supabase.co/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [], error: null }) })
  );

  await page.route("**/partykit/**", (route) => route.abort());

  return courseData;
}
