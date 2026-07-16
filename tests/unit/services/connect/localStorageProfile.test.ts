import { describe, it, expect, beforeEach } from "vitest";
import { localStorageProfile } from "$lib/services/connect/services/localStorageProfile";
import { createCourse, resetCourseCounter } from "../../../fixtures/course-factory";

/**
 * Helper: the source code writes to localStorage via direct property access
 * (e.g. `localStorage.courseVisits = "..."`), not setItem.
 * This helper reads the property the same way to stay consistent.
 */
function getStoredVisits(): any[] {
  const raw = (localStorage as any).courseVisits;
  return raw ? JSON.parse(raw) : [];
}

beforeEach(() => {
  localStorage.clear();
  // The source writes via direct property access, which bypasses the
  // internal store map. We must also delete the property itself.
  delete (localStorage as any).courseVisits;
  localStorageProfile.courseVisits = [];
  resetCourseCounter();
});

// ---------------------------------------------------------------------------
// logCourseVisit
// ---------------------------------------------------------------------------
describe("logCourseVisit", () => {
  it("stores a new course visit in localStorage", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);

    const stored = getStoredVisits();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(course.courseId);
    expect(stored[0].title).toBe(course.title);
    expect(stored[0].visits).toBe(1);
    expect(stored[0].credits).toBe(course.properties.credits);
  });

  it("increments visit count on subsequent visits", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.logCourseVisit(course);

    const stored = getStoredVisits();
    expect(stored).toHaveLength(1);
    expect(stored[0].visits).toBe(3);
  });

  it("updates lastVisit timestamp on repeat visits", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);

    const firstStored = getStoredVisits();
    const firstVisitTime = firstStored[0].lastVisit;

    localStorageProfile.logCourseVisit(course);

    const secondStored = getStoredVisits();
    expect(new Date(secondStored[0].lastVisit).getTime()).toBeGreaterThanOrEqual(new Date(firstVisitTime).getTime());
  });

  it("stores the course image when no icon is set", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);

    const stored = getStoredVisits();
    expect(stored[0].image).toBe(course.img);
    expect(stored[0].icon).toBeUndefined();
  });

  it("stores the course icon when icon property is set", () => {
    const icon = { type: "fluent:notebook-24-filled", color: "primary" };
    const course = createCourse({ properties: { credits: "Author", icon } });
    localStorageProfile.logCourseVisit(course);

    const stored = getStoredVisits();
    expect(stored[0].icon).toEqual(icon);
    expect(stored[0].image).toBeUndefined();
  });

  it("prepends new visits to the beginning of the array", () => {
    const courseA = createCourse();
    const courseB = createCourse();
    localStorageProfile.logCourseVisit(courseA);
    localStorageProfile.logCourseVisit(courseB);

    const stored = getStoredVisits();
    expect(stored[0].id).toBe(courseB.courseId);
    expect(stored[1].id).toBe(courseA.courseId);
  });
});

// ---------------------------------------------------------------------------
// getCourseVisits
// ---------------------------------------------------------------------------
describe("getCourseVisits", () => {
  it("returns an empty array when no visits exist", () => {
    const visits = localStorageProfile.getCourseVisits();
    expect(visits).toEqual([]);
  });

  it("retrieves all stored visits", () => {
    const courseA = createCourse();
    const courseB = createCourse();
    localStorageProfile.logCourseVisit(courseA);
    localStorageProfile.logCourseVisit(courseB);

    const visits = localStorageProfile.getCourseVisits();
    expect(visits).toHaveLength(2);
  });

  it("reloads from localStorage to pick up externally-written data", () => {
    const externalData = [
      { id: "ext-1", title: "External", lastVisit: new Date(), credits: "X", visits: 5 }
    ];
    // Write via direct property access, matching how the source reads it
    (localStorage as any).courseVisits = JSON.stringify(externalData);

    const visits = localStorageProfile.getCourseVisits() as any;
    expect(visits).toHaveLength(1);
    expect(visits[0].id).toBe("ext-1");
    expect(visits[0].visits).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// favouriteCourse / unfavouriteCourse
// ---------------------------------------------------------------------------
describe("favouriteCourse", () => {
  it("marks a visited course as favourite", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.favouriteCourse(course.courseId);

    const stored = getStoredVisits();
    expect(stored[0].favourite).toBe(true);
  });

  it("does nothing if courseId is not found", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.favouriteCourse("nonexistent-id");

    const stored = getStoredVisits();
    expect(stored[0].favourite).toBeUndefined();
  });
});

describe("unfavouriteCourse", () => {
  it("removes favourite flag from a course", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.favouriteCourse(course.courseId);
    localStorageProfile.unfavouriteCourse(course.courseId);

    const stored = getStoredVisits();
    expect(stored[0].favourite).toBe(false);
  });

  it("does nothing if courseId is not found", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.favouriteCourse(course.courseId);
    localStorageProfile.unfavouriteCourse("nonexistent-id");

    const stored = getStoredVisits();
    expect(stored[0].favourite).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// deleteCourseVisit
// ---------------------------------------------------------------------------
describe("deleteCourseVisit", () => {
  it("removes a course visit by id", () => {
    const courseA = createCourse();
    const courseB = createCourse();
    localStorageProfile.logCourseVisit(courseA);
    localStorageProfile.logCourseVisit(courseB);

    localStorageProfile.deleteCourseVisit(courseA.courseId);

    const stored = getStoredVisits();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(courseB.courseId);
  });

  it("does not affect other visits when deleting", () => {
    const courseA = createCourse();
    const courseB = createCourse();
    const courseC = createCourse();
    localStorageProfile.logCourseVisit(courseA);
    localStorageProfile.logCourseVisit(courseB);
    localStorageProfile.logCourseVisit(courseC);

    localStorageProfile.deleteCourseVisit(courseB.courseId);

    const stored = getStoredVisits();
    expect(stored).toHaveLength(2);
    const ids = stored.map((v: any) => v.id);
    expect(ids).toContain(courseA.courseId);
    expect(ids).toContain(courseC.courseId);
    expect(ids).not.toContain(courseB.courseId);
  });

  it("is a no-op when deleting a non-existent course id", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);

    localStorageProfile.deleteCourseVisit("nonexistent-id");

    const stored = getStoredVisits();
    expect(stored).toHaveLength(1);
  });

  it("results in an empty array when the last visit is deleted", () => {
    const course = createCourse();
    localStorageProfile.logCourseVisit(course);
    localStorageProfile.deleteCourseVisit(course.courseId);

    const stored = getStoredVisits();
    expect(stored).toEqual([]);
  });
});
