import { createCourse, resetCourseCounter } from "../../../fixtures/course-factory";

vi.mock("$app/environment", () => ({ browser: true }));

const { localStorageProfile } = await import("$lib/services/connect/services/localStorageProfile");

describe("localStorageProfile", () => {
  beforeEach(() => {
    resetCourseCounter();
    localStorage.clear();
    localStorageProfile.courseVisits = [];
  });

  describe("logCourseVisit", () => {
    it("adds a new course visit", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits).toHaveLength(1);
      expect(localStorageProfile.courseVisits[0].id).toBe(course.courseId);
    });

    it("increments visit count for existing course", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits).toHaveLength(1);
      expect(localStorageProfile.courseVisits[0].visits).toBe(2);
    });

    it("persists visits to localStorage", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      const stored = JSON.parse(localStorage.courseVisits);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(course.courseId);
    });

    it("stores course title", () => {
      const course = createCourse({ title: "My Course" }) as any;
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits[0].title).toBe("My Course");
    });

    it("stores course credits", () => {
      const course = createCourse({ properties: { credits: "Author Name" } }) as any;
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits[0].credits).toBe("Author Name");
    });

    it("stores icon when course has one", () => {
      const course = createCourse({
        properties: { credits: "Author", icon: { type: "fluent", color: "primary" } }
      }) as any;
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits[0].icon).toBeDefined();
    });

    it("stores img when course has no icon", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      expect(localStorageProfile.courseVisits[0].img).toBe(course.img);
    });

    it("adds new visits at the beginning of the array", () => {
      const course1 = createCourse() as any;
      const course2 = createCourse() as any;
      localStorageProfile.logCourseVisit(course1);
      localStorageProfile.logCourseVisit(course2);
      expect(localStorageProfile.courseVisits[0].id).toBe(course2.courseId);
    });
  });

  describe("deleteCourseVisit", () => {
    it("removes a course visit by id", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      localStorageProfile.deleteCourseVisit(course.courseId);
      expect(localStorageProfile.courseVisits).toHaveLength(0);
    });

    it("does not remove other course visits", () => {
      const course1 = createCourse() as any;
      const course2 = createCourse() as any;
      localStorageProfile.logCourseVisit(course1);
      localStorageProfile.logCourseVisit(course2);
      localStorageProfile.deleteCourseVisit(course1.courseId);
      expect(localStorageProfile.courseVisits).toHaveLength(1);
      expect(localStorageProfile.courseVisits[0].id).toBe(course2.courseId);
    });

    it("updates localStorage after deletion", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      localStorageProfile.deleteCourseVisit(course.courseId);
      const stored = JSON.parse(localStorage.courseVisits);
      expect(stored).toHaveLength(0);
    });
  });

  describe("getCourseVisits", () => {
    it("returns empty array when no visits", () => {
      const visits = localStorageProfile.getCourseVisits() as any;
      expect(visits).toHaveLength(0);
    });

    it("returns visits after logging courses", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      const visits = localStorageProfile.getCourseVisits() as any;
      expect(visits).toHaveLength(1);
    });

    it("reloads from localStorage", () => {
      localStorage.courseVisits = JSON.stringify([
        { id: "stored-course", title: "Stored", lastVisit: new Date(), credits: "Author", visits: 3 }
      ]);
      const visits = localStorageProfile.getCourseVisits() as any;
      expect(visits).toHaveLength(1);
      expect(visits[0].id).toBe("stored-course");
    });
  });

  describe("favouriteCourse", () => {
    it("marks a course as favourite", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      localStorageProfile.favouriteCourse(course.courseId);
      expect(localStorageProfile.courseVisits[0].favourite).toBe(true);
    });

    it("does nothing for non-existent course", () => {
      localStorageProfile.favouriteCourse("non-existent");
      expect(localStorageProfile.courseVisits).toHaveLength(0);
    });
  });

  describe("unfavouriteCourse", () => {
    it("removes favourite status from a course", () => {
      const course = createCourse() as any;
      localStorageProfile.logCourseVisit(course);
      localStorageProfile.favouriteCourse(course.courseId);
      localStorageProfile.unfavouriteCourse(course.courseId);
      expect(localStorageProfile.courseVisits[0].favourite).toBe(false);
    });
  });
});
