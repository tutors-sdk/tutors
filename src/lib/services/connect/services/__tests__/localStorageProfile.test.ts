import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Course } from "@tutors/tutors-model-lib";
import { localStorageProfile } from "../localStorageProfile";

vi.mock("$app/environment", () => ({ browser: true }));

describe("Feature: Local course history recovery", () => {
  const visit = { id: "sample", title: "Sample course", visits: 2, lastVisit: "2026-01-01T00:00:00.000Z" };

  beforeEach(() => {
    localStorageProfile.courseVisits = [];
    vi.stubGlobal("localStorage", {});
  });

  afterEach(() => vi.unstubAllGlobals());

  it("WHEN valid history is stored reloading shall preserve it", () => {
    localStorage.courseVisits = JSON.stringify([visit]);
    localStorageProfile.reload();
    expect(localStorageProfile.courseVisits).toEqual([visit]);
  });

  it("WHEN stored history is removed reloading shall clear stale entries", () => {
    localStorage.courseVisits = JSON.stringify([visit]);
    localStorageProfile.reload();
    delete localStorage.courseVisits;
    localStorageProfile.reload();
    expect(localStorageProfile.courseVisits).toEqual([]);
  });

  it.each(["{invalid", "null", "{}", '"history"', "42"])("IF stored history is %s reloading shall recover without throwing", (stored) => {
    localStorage.courseVisits = JSON.stringify([visit]);
    localStorageProfile.reload();
    localStorage.courseVisits = stored;
    expect(() => localStorageProfile.reload()).not.toThrow();
    expect(localStorageProfile.courseVisits).toEqual([]);
  });

  it("WHEN visiting a course after corruption the new visit shall be saved", () => {
    localStorage.courseVisits = "{invalid";
    const course = { courseId: "new-course", title: "New course", properties: { credits: "5" }, img: "course.png" } as Course;
    localStorageProfile.logCourseVisit(course);
    expect(JSON.parse(localStorage.courseVisits)).toEqual([expect.objectContaining({ id: "new-course", title: "New course", visits: 1, credits: "5" })]);
  });
});
