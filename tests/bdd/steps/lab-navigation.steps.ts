import { Given, When, Then } from "quickpickle";
import { expect } from "vitest";
import { LiveLab } from "$lib/services/course/services/live-lab";
import type { Lab, Course } from "@tutors/tutors-model-lib";

let liveLab: LiveLab;
let nextStepResult: string;
let prevStepResult: string;

function createTestLab(stepTitles: string[]): { course: Course; lab: Lab } {
  const lab = {
    type: "lab",
    title: "Test Lab",
    shortTitle: "lab-01",
    route: "/lab/test-course/lab-01",
    los: stepTitles.map((title, i) => ({
      shortTitle: `Step${String(i + 1).padStart(2, "0")}`,
      title: `# ${title}`,
      contentHtml: `<p>${title} content</p>`
    }))
  } as unknown as Lab;

  const course = {
    courseId: "test-course",
    areLabStepsAutoNumbered: false
  } as unknown as Course;

  return { course, lab };
}

Given("a lab with steps {string}, {string}, {string}, {string}", (world: any, s1: string, s2: string, s3: string, s4: string) => {
  const { course, lab } = createTestLab([s1, s2, s3, s4]);
  liveLab = new LiveLab(course, lab, "/lab/test-course/lab-01");
});

When("the lab is first opened", (world: any) => {
  liveLab.setFirstPageActive();
});

Then("the current chapter shall be {string}", (world: any, step: string) => {
  expect(liveLab.currentChapterShortTitle).toBe(step);
});

Then("the step index shall be {int}", (world: any, index: number) => {
  expect(liveLab.index).toBe(index);
});

Given("the current step is {string}", (world: any, step: string) => {
  liveLab.setCurrentChapter(step);
});

When("the user requests the next step", (world: any) => {
  nextStepResult = liveLab.nextStep();
});

Then("the next step shall be {string}", (world: any, expected: string) => {
  expect(nextStepResult).toBe(expected);
});

Then("the next step shall be empty", (world: any) => {
  expect(nextStepResult).toBe("");
});

When("the user requests the previous step", (world: any) => {
  prevStepResult = liveLab.prevStep();
});

Then("the previous step shall be {string}", (world: any, expected: string) => {
  expect(prevStepResult).toBe(expected);
});

Then("the previous step shall be empty", (world: any) => {
  expect(prevStepResult).toBe("");
});

When("the user navigates to step {string}", (world: any, step: string) => {
  liveLab.setCurrentChapter(step);
});

Then("the navigation HTML shall contain links", (world: any) => {
  expect(liveLab.navbarHtml).toContain("href=");
});

Then("the current chapter shall remain {string}", (world: any, step: string) => {
  expect(liveLab.currentChapterShortTitle).toBe(step);
});
