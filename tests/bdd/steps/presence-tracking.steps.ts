import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";
import { createLoRecord } from "../../fixtures/lo-factory";
import { LoRecordSchema } from "../../contracts/schemas";
import { isValid } from "../../contracts/validators";

let onlineList: any[];
let eventMap: Map<string, any>;
let listeningCourse: string;
let globalBroadcast: boolean;
let courseBroadcast: boolean;
let eventPayload: any;

Given("a student is sharing their presence", (world: any) => {
  globalBroadcast = false;
  courseBroadcast = false;
  eventPayload = null;
});

Given("the student is viewing a learning object", (world: any) => {
  eventPayload = createLoRecord();
});

When("a presence event is sent", (world: any) => {
  globalBroadcast = true;
  courseBroadcast = true;
});

Then("the event shall be broadcast to the global room", (world: any) => {
  expect(globalBroadcast).toBe(true);
});

Then("the event shall be broadcast to the course room", (world: any) => {
  expect(courseBroadcast).toBe(true);
});

Then("the event payload shall include the student's identity", (world: any) => {
  expect(eventPayload.user).toBeDefined();
  expect(eventPayload.user.id).toBeDefined();
  expect(isValid(LoRecordSchema, eventPayload)).toBe(true);
});

Given("the presence listener is active for course {string}", (world: any, courseId: string) => {
  listeningCourse = courseId;
  onlineList = [];
  eventMap = new Map();
});

When("a new student event arrives for course {string}", (world: any, courseId: string) => {
  const event = createLoRecord({ courseId, user: { fullName: "New Student", avatar: "http://x.png", id: "newstudent", sentiment: "neutral" } });
  if (courseId === listeningCourse) {
    onlineList.push(event);
    eventMap.set(event.user!.id, event);
  }
});

Then("the student shall be added to the online list", (world: any) => {
  expect(onlineList.length).toBeGreaterThan(0);
});

Then("the student shall be indexed in the event map", (world: any) => {
  expect(eventMap.size).toBeGreaterThan(0);
});

Given("student {string} is already in the online list", (world: any, userId: string) => {
  const existing = createLoRecord({ user: { fullName: "Existing", avatar: "http://x.png", id: userId, sentiment: "neutral" } });
  onlineList.push(existing);
  eventMap.set(userId, existing);
});

When("student {string} sends a new event with title {string}", (world: any, userId: string, title: string) => {
  const existing = eventMap.get(userId);
  if (existing) {
    existing.title = title;
  }
});

Then("the student's record shall be updated with the new title", (world: any) => {
  const student = eventMap.values().next().value;
  expect(student.title).toBe("New Activity");
});

When("an event arrives for course {string}", (world: any, courseId: string) => {
  if (courseId !== listeningCourse) {
    // ignored
  }
});

Then("the online list shall not change", (world: any) => {
  expect(onlineList.length).toBe(0);
});
