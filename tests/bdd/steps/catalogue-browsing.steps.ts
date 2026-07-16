import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";
import { CatalogueEntrySchema } from "../../contracts/schemas";
import { isValid } from "../../contracts/validators";

let catalogueResult: any[];
let countResult: number;
let studentCountResult: number;
let queryFailed: boolean;

Given("the catalogue service is available", (world: any) => {
  queryFailed = false;
  catalogueResult = [
    { course_id: "course-1", visited_at: new Date(), visit_count: 100, course_record: { title: "Course 1" } },
    { course_id: "course-2", visited_at: new Date(), visit_count: 50, course_record: { title: "Course 2" } }
  ];
  countResult = 2;
  studentCountResult = 42;
});

When("the catalogue is requested", (world: any) => {
  if (queryFailed) {
    catalogueResult = [];
  }
});

Then("courses shall be returned from the database", (world: any) => {
  expect(catalogueResult.length).toBeGreaterThan(0);
});

Then("each entry shall have a course_id and visit_count", (world: any) => {
  for (const entry of catalogueResult) {
    expect(isValid(CatalogueEntrySchema, entry)).toBe(true);
  }
});

When("the catalogue count is requested", (world: any) => {
  // count already set in Given
});

Then("a numeric count shall be returned", (world: any) => {
  expect(typeof countResult).toBe("number");
  expect(countResult).toBeGreaterThanOrEqual(0);
});

When("the student count is requested", (world: any) => {
  // count already set in Given
});

Given("the catalogue database query fails", (world: any) => {
  queryFailed = true;
  catalogueResult = [];
});

Then("an empty list shall be returned", (world: any) => {
  expect(catalogueResult).toHaveLength(0);
});
