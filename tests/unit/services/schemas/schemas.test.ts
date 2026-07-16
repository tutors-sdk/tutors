import { describe, it, expect } from "vitest";
import { assertValid, isValid } from "../../../contracts/validators";
import {
  TutorsIdSchema,
  CourseVisitSchema,
  LoUserSchema,
  LoRecordSchema,
  CourseSentimentIdSchema,
  LayoutTypeSchema,
  CardStyleTypeSchema,
  CourseUrlResultSchema,
  CourseSchema
} from "../../../contracts/schemas";

describe("TutorsIdSchema", () => {
  it("accepts a valid TutorsId object", () => {
    const data = {
      name: "A",
      login: "a",
      email: "a@b.com",
      image: "http://x.png",
      share: "true",
      sentiment: "neutral"
    };
    const result = assertValid(TutorsIdSchema, data);
    expect(result).toEqual(data);
  });

  it("rejects when login field is missing", () => {
    const data = {
      name: "A",
      email: "a@b.com",
      image: "http://x.png",
      share: "true",
      sentiment: "neutral"
    };
    expect(isValid(TutorsIdSchema, data)).toBe(false);
  });
});

describe("CourseVisitSchema", () => {
  it("accepts a valid CourseVisit object", () => {
    const data = {
      id: "c1",
      title: "Course",
      lastVisit: new Date(),
      credits: "Author"
    };
    const result = assertValid(CourseVisitSchema, data);
    expect(result.id).toBe("c1");
  });

  it("rejects when id is missing", () => {
    const data = {
      title: "Course",
      lastVisit: new Date(),
      credits: "Author"
    };
    expect(isValid(CourseVisitSchema, data)).toBe(false);
  });
});

describe("LoUserSchema", () => {
  it("accepts a valid LoUser object", () => {
    const data = {
      fullName: "A",
      avatar: "http://x.png",
      id: "u1",
      sentiment: "neutral"
    };
    const result = assertValid(LoUserSchema, data);
    expect(result).toEqual(data);
  });

  it("rejects when id is missing", () => {
    const data = {
      fullName: "A",
      avatar: "http://x.png",
      sentiment: "neutral"
    };
    expect(isValid(LoUserSchema, data)).toBe(false);
  });
});

describe("LoRecordSchema", () => {
  it("accepts a full LoRecord with user", () => {
    const data = {
      courseId: "test-course",
      courseUrl: "test-course.netlify.app",
      courseTitle: "Test Course",
      loRoute: "/lab/test-course/lab-01",
      title: "Lab 1",
      img: "https://test-course.netlify.app/img/lab.png",
      isPrivate: false,
      type: "lab",
      user: {
        fullName: "Test User",
        avatar: "https://avatars.example.com/1.png",
        id: "testuser1",
        sentiment: "neutral"
      }
    };
    const result = assertValid(LoRecordSchema, data);
    expect(result.courseId).toBe("test-course");
    expect(result.user?.fullName).toBe("Test User");
  });

  it("rejects when courseId is missing", () => {
    const data = {
      courseUrl: "test-course.netlify.app",
      courseTitle: "Test Course",
      loRoute: "/lab/test-course/lab-01",
      title: "Lab 1",
      isPrivate: false,
      type: "lab"
    };
    expect(isValid(LoRecordSchema, data)).toBe(false);
  });
});

describe("CourseSentimentIdSchema", () => {
  const validValues = ["neutral", "fine", "delighted", "confident", "overwhelmed", "confused", "drained"];

  it.each(validValues)("accepts valid sentiment value: %s", (value) => {
    const result = assertValid(CourseSentimentIdSchema, value);
    expect(result).toBe(value);
  });

  it("rejects invalid sentiment value", () => {
    expect(isValid(CourseSentimentIdSchema, "happy")).toBe(false);
  });
});

describe("LayoutTypeSchema", () => {
  it("accepts 'expanded'", () => {
    expect(assertValid(LayoutTypeSchema, "expanded")).toBe("expanded");
  });

  it("accepts 'compacted'", () => {
    expect(assertValid(LayoutTypeSchema, "compacted")).toBe("compacted");
  });

  it("rejects 'wide'", () => {
    expect(isValid(LayoutTypeSchema, "wide")).toBe(false);
  });
});

describe("CardStyleTypeSchema", () => {
  it("accepts 'portrait'", () => {
    expect(assertValid(CardStyleTypeSchema, "portrait")).toBe("portrait");
  });

  it("accepts 'landscape'", () => {
    expect(assertValid(CardStyleTypeSchema, "landscape")).toBe("landscape");
  });

  it("accepts 'circular'", () => {
    expect(assertValid(CardStyleTypeSchema, "circular")).toBe("circular");
  });

  it("rejects 'square'", () => {
    expect(isValid(CardStyleTypeSchema, "square")).toBe(false);
  });
});

describe("CourseUrlResultSchema", () => {
  it("accepts a valid CourseUrlResult", () => {
    const data = { courseId: "x", courseUrl: "x.netlify.app" };
    const result = assertValid(CourseUrlResultSchema, data);
    expect(result).toEqual(data);
  });

  it("rejects when courseUrl is missing", () => {
    const data = { courseId: "x" };
    expect(isValid(CourseUrlResultSchema, data)).toBe(false);
  });
});

describe("CourseSchema", () => {
  it("accepts a minimal valid course object", () => {
    const data = {
      courseId: "test-course",
      courseUrl: "test-course.netlify.app",
      title: "Test Course",
      route: "/course/test-course",
      type: "course" as const,
      los: []
    };
    const result = assertValid(CourseSchema, data);
    expect(result.courseId).toBe("test-course");
  });

  it("rejects when title is missing", () => {
    const data = {
      courseId: "test-course",
      courseUrl: "test-course.netlify.app",
      route: "/course/test-course",
      type: "course" as const,
      los: []
    };
    expect(isValid(CourseSchema, data)).toBe(false);
  });
});
