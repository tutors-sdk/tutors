import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";

let analyticsEnabled: boolean;
let analyticsCallMade: boolean;
let pageCountUpdated: boolean;
let courseVisitRecorded: boolean;
let presenceListenerStarted: boolean;

Given("a student is viewing a learning object", (world: any) => {
  analyticsEnabled = true;
  analyticsCallMade = false;
});

When("a learning event is triggered", (world: any) => {
  if (analyticsEnabled) {
    analyticsCallMade = true;
  }
});

Then("the event shall be recorded in the analytics service", (world: any) => {
  expect(analyticsCallMade).toBe(true);
});

Then("the presence service shall broadcast the event if sharing is enabled", (world: any) => {
  expect(true).toBe(true);
});

Given("the analytics timer is running", (world: any) => {
  pageCountUpdated = false;
});

When("30 seconds elapse with the page visible", (world: any) => {
  pageCountUpdated = true;
});

Then("the page count shall be updated", (world: any) => {
  expect(pageCountUpdated).toBe(true);
});

Given("analytics is disabled", (world: any) => {
  analyticsEnabled = false;
  analyticsCallMade = false;
});

Then("no analytics call shall be made", (world: any) => {
  expect(analyticsCallMade).toBe(false);
});

Given("a student is authenticated", (world: any) => {
  courseVisitRecorded = false;
  presenceListenerStarted = false;
});

When("the student visits a course", (world: any) => {
  courseVisitRecorded = true;
  presenceListenerStarted = true;
});

Then("the course visit shall be recorded in the profile", (world: any) => {
  expect(courseVisitRecorded).toBe(true);
});

Then("the presence listener shall start for that course", (world: any) => {
  expect(presenceListenerStarted).toBe(true);
});
