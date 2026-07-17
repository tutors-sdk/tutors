import {
  TutorsIdSchema,
  CourseVisitSchema,
  LoUserSchema,
  LoRecordSchema,
  TutorsConnectLatestRowSchema,
  CatalogueEntrySchema,
  IconTypeSchema,
  ThemeSchema,
  LayoutTypeSchema,
  CardStyleTypeSchema,
  CourseSentimentIdSchema,
  CourseUrlResultSchema,
  LoSchema,
  LabStepSchema,
  LabSchema,
  CourseSchema
} from "../../../contracts/schemas";
import { assertValid, isValid, validationErrors } from "../../../contracts/validators";
import { createTutorsId, createLoUser, resetUserCounter } from "../../../fixtures/user-factory";
import { createCourse, resetCourseCounter } from "../../../fixtures/course-factory";
import { createLoRecord, createLo } from "../../../fixtures/lo-factory";

describe("Zod contract schemas", () => {
  beforeEach(() => {
    resetUserCounter();
    resetCourseCounter();
  });

  describe("IconTypeSchema", () => {
    it("validates a valid icon", () => {
      expect(isValid(IconTypeSchema, { type: "fluent", color: "primary" })).toBe(true);
    });

    it("rejects missing fields", () => {
      expect(isValid(IconTypeSchema, { type: "fluent" })).toBe(false);
    });
  });

  describe("CourseSentimentIdSchema", () => {
    it("accepts all valid sentiments", () => {
      for (const s of ["neutral", "fine", "delighted", "confident", "overwhelmed", "confused", "drained"]) {
        expect(isValid(CourseSentimentIdSchema, s)).toBe(true);
      }
    });

    it("rejects invalid sentiment", () => {
      expect(isValid(CourseSentimentIdSchema, "happy")).toBe(false);
    });
  });

  describe("TutorsIdSchema", () => {
    it("validates factory-created TutorsId", () => {
      const user = createTutorsId();
      expect(isValid(TutorsIdSchema, user)).toBe(true);
    });

    it("rejects missing login", () => {
      const user = createTutorsId();
      delete (user as any).login;
      expect(isValid(TutorsIdSchema, user)).toBe(false);
    });
  });

  describe("CourseVisitSchema", () => {
    it("validates a course visit", () => {
      const visit = {
        id: "course-1",
        title: "Test Course",
        lastVisit: new Date(),
        credits: "Author",
        visits: 3
      };
      expect(isValid(CourseVisitSchema, visit)).toBe(true);
    });

    it("coerces string dates", () => {
      const visit = {
        id: "course-1",
        title: "Test Course",
        lastVisit: "2025-01-01",
        credits: "Author"
      };
      const parsed = assertValid(CourseVisitSchema, visit);
      expect(parsed.lastVisit).toBeInstanceOf(Date);
    });
  });

  describe("LoUserSchema", () => {
    it("validates factory-created LoUser", () => {
      const user = createLoUser();
      expect(isValid(LoUserSchema, user)).toBe(true);
    });
  });

  describe("LoRecordSchema", () => {
    it("validates a factory-created LoRecord", () => {
      const record = createLoRecord();
      expect(isValid(LoRecordSchema, record)).toBe(true);
    });
  });

  describe("TutorsConnectLatestRowSchema", () => {
    it("validates a latest row", () => {
      const row = {
        course_id: "course-1",
        student_id: "student-1",
        payload: { key: "value" },
        received_at: "2025-01-01T00:00:00Z"
      };
      expect(isValid(TutorsConnectLatestRowSchema, row)).toBe(true);
    });
  });

  describe("CatalogueEntrySchema", () => {
    it("validates a catalogue entry", () => {
      const entry = {
        course_id: "course-1",
        visited_at: new Date(),
        visit_count: 5,
        course_record: {}
      };
      expect(isValid(CatalogueEntrySchema, entry)).toBe(true);
    });
  });

  describe("LayoutTypeSchema", () => {
    it("accepts expanded and compacted", () => {
      expect(isValid(LayoutTypeSchema, "expanded")).toBe(true);
      expect(isValid(LayoutTypeSchema, "compacted")).toBe(true);
    });

    it("rejects invalid layout", () => {
      expect(isValid(LayoutTypeSchema, "grid")).toBe(false);
    });
  });

  describe("CardStyleTypeSchema", () => {
    it("accepts valid card styles", () => {
      expect(isValid(CardStyleTypeSchema, "portrait")).toBe(true);
      expect(isValid(CardStyleTypeSchema, "landscape")).toBe(true);
      expect(isValid(CardStyleTypeSchema, "circular")).toBe(true);
    });
  });

  describe("ThemeSchema", () => {
    it("validates a theme with icons", () => {
      const theme = {
        name: "tutors",
        icons: {
          course: { type: "fluent", color: "primary" },
          topic: { type: "fluent", color: "secondary" }
        }
      };
      expect(isValid(ThemeSchema, theme)).toBe(true);
    });
  });

  describe("LoSchema", () => {
    it("validates a factory-created Lo", () => {
      const lo = createLo();
      expect(isValid(LoSchema, lo)).toBe(true);
    });
  });

  describe("LabStepSchema", () => {
    it("validates a lab step", () => {
      const step = {
        shortTitle: "Step01",
        title: "# Introduction",
        contentHtml: "<p>Content</p>",
        type: "step"
      };
      expect(isValid(LabStepSchema, step)).toBe(true);
    });
  });

  describe("CourseSchema", () => {
    it("validates a minimal course structure", () => {
      const course = {
        courseId: "test-course",
        courseUrl: "test-course.netlify.app",
        title: "Test Course",
        route: "/course/test-course",
        type: "course" as const,
        los: []
      };
      expect(isValid(CourseSchema, course)).toBe(true);
    });
  });

  describe("CourseUrlResultSchema", () => {
    it("validates a course URL result", () => {
      expect(isValid(CourseUrlResultSchema, { courseId: "test", courseUrl: "test.netlify.app" })).toBe(true);
    });
  });

  describe("validators", () => {
    it("assertValid returns parsed data on success", () => {
      const result = assertValid(TutorsIdSchema, createTutorsId());
      expect(result.login).toBeDefined();
    });

    it("assertValid throws on invalid data", () => {
      expect(() => assertValid(TutorsIdSchema, { name: "x" })).toThrow();
    });

    it("validationErrors returns empty array for valid data", () => {
      expect(validationErrors(TutorsIdSchema, createTutorsId())).toHaveLength(0);
    });

    it("validationErrors returns errors for invalid data", () => {
      const errors = validationErrors(TutorsIdSchema, { name: "x" });
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
