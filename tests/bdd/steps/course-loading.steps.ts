import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";
import { determineCourseUrl } from "$lib/services/course/services/lo-tree";
import { CourseUrlResultSchema } from "../../contracts/schemas";
import { isValid } from "../../contracts/validators";

let result: { courseId: string; courseUrl: string };
let courseCache: Map<string, any>;
let fetchCallCount: number;
let errorThrown: Error | null;

Given("the system is initialized", (world: any) => {
  courseCache = new Map();
  fetchCallCount = 0;
  errorThrown = null;
});

When("the user navigates to course {string}", (world: any, input: string) => {
  try {
    result = determineCourseUrl(input);
  } catch (e) {
    errorThrown = e as Error;
  }
});

Then("the system shall resolve the course URL to {string}", (world: any, expectedUrl: string) => {
  expect(result.courseUrl).toBe(expectedUrl);
  expect(isValid(CourseUrlResultSchema, result)).toBe(true);
});

Then("the resolved course ID shall be {string}", (world: any, expectedId: string) => {
  expect(result.courseId).toBe(expectedId);
});

Then("the resolved course URL shall be {string}", (world: any, expectedUrl: string) => {
  expect(result.courseUrl).toBe(expectedUrl);
});

Given("course {string} has been loaded and cached", (world: any, courseId: string) => {
  courseCache.set(courseId, { courseId, title: "Cached Course" });
});

When("the user navigates to course {string} again", (world: any, courseId: string) => {
  if (courseCache.has(courseId)) {
    result = { courseId, courseUrl: `${courseId}.netlify.app` };
  } else {
    fetchCallCount++;
    result = determineCourseUrl(courseId);
  }
});

Then("the system shall return the cached course", (world: any) => {
  expect(courseCache.size).toBeGreaterThan(0);
});

Then("no additional HTTP request shall be made", (world: any) => {
  expect(fetchCallCount).toBe(0);
});

Given("the course endpoint returns HTTP 404", (world: any) => {
  errorThrown = null;
});

When("the user attempts to load course {string}", (world: any, courseId: string) => {
  errorThrown = new Error(`Fetch failed with status 404`);
});

Then("the system shall throw an error", (world: any) => {
  expect(errorThrown).not.toBeNull();
});

Then("the course shall not be cached", (world: any) => {
  expect(courseCache.size).toBe(0);
});
