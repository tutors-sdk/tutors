import { describe, it, expect, beforeEach } from "vitest";
import { injectCourseUrl, determineCourseUrl } from "../lo-tree";
import { courseProtocol } from "$lib/runes.svelte";
import type { Lo } from "@tutors/tutors-model-lib";

/**
 * Tests specifically designed to kill remaining mutants and reach 80% mutation score
 * Focuses on: Optional chaining, type conditionals, regex edge cases
 */

describe("injectCourseUrl() - Optional Chaining Killers", () => {
  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  describe("WHEN properties are undefined (optional chaining)", () => {
    it("shall handle undefined img safely", () => {
      const los: Lo[] = [
        {
          type: "topic",
          title: "Test",
          route: "/topic/test"
          // img is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect(los[0].img).toBeUndefined();
    });

    it("shall handle undefined video safely", () => {
      const los: Lo[] = [
        {
          type: "video",
          title: "Test",
          route: "/video/test"
          // video is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect(los[0].video).toBeUndefined();
    });

    it("shall handle undefined talk pdf safely", () => {
      const los: Lo[] = [
        {
          type: "talk",
          title: "Test",
          route: "/talk/test"
          // pdf is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      const talk = los[0] as any;
      expect(talk.pdf).toBeUndefined();
    });

    it("shall handle undefined paneltalk pdf safely", () => {
      const los: Lo[] = [
        {
          type: "paneltalk",
          title: "Test",
          route: "/paneltalk/test"
          // pdf is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBeUndefined();
    });

    it("shall handle undefined lab pdf safely", () => {
      const los: Lo[] = [
        {
          type: "lab",
          title: "Test",
          route: "/lab/test"
          // pdf is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBeUndefined();
    });

    it("shall handle defined tutorial pdf correctly", () => {
      const los: Lo[] = [
        {
          type: "tutorial",
          title: "Test",
          route: "/tutorial/test",
          pdf: "https://{{COURSEURL}}/tut.pdf"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBe("https://test.com/tut.pdf");
      expect((los[0] as any).pdf).not.toContain("{{COURSEURL}}");
    });
  });

  describe("WHEN type is NOT talk/paneltalk/tutorial/lab", () => {
    it("shall skip pdf replacement for video type", () => {
      const los: Lo[] = [
        {
          type: "video",
          title: "Video",
          route: "/video/test",
          video: "https://{{COURSEURL}}/vid.mp4"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      // Video gets replaced, but pdf logic is skipped
      expect(los[0].video).toBe("https://test/vid.mp4");
    });

    it("shall skip pdf replacement for note type", () => {
      const los: Lo[] = [
        {
          type: "note",
          title: "Note",
          route: "/note/test",
          img: "https://{{COURSEURL}}/img.png"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      // Img gets replaced, but pdf logic is skipped
      expect(los[0].img).toBe("https://test.com/img.png");
    });
  });

  describe("WHEN courseProtocol is http://", () => {
    it("shall replace all https:// in route", () => {
      courseProtocol.value = "http://";

      const los: Lo[] = [
        {
          type: "topic",
          title: "Test",
          route: "https://example.com/topic"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect(los[0].route).toBe("http://example.com/topic");
      expect(los[0].route).not.toContain("https://");
    });

    it("shall replace https:// in video when defined", () => {
      courseProtocol.value = "http://";

      const los: Lo[] = [
        {
          type: "video",
          title: "Video",
          route: "/video/test",
          video: "https://example.com/vid.mp4"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect(los[0].video).toBe("http://example.com/vid.mp4");
    });

    it("shall replace https:// in img when defined", () => {
      courseProtocol.value = "http://";

      const los: Lo[] = [
        {
          type: "topic",
          title: "Topic",
          route: "/topic/test",
          img: "https://example.com/img.png"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect(los[0].img).toBe("http://example.com/img.png");
    });

    it("shall replace https:// in pdf when defined", () => {
      courseProtocol.value = "http://";

      const los: Lo[] = [
        {
          type: "talk",
          title: "Talk",
          route: "/talk/test",
          pdf: "https://example.com/slides.pdf"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBe("http://example.com/slides.pdf");
    });

    it("shall not crash when pdf is undefined in http mode", () => {
      courseProtocol.value = "http://";

      const los: Lo[] = [
        {
          type: "note",
          title: "Note",
          route: "/note/test"
          // pdf is undefined
        } as any
      ];

      expect(() => injectCourseUrl(los, "test", "test.com")).not.toThrow();
    });
  });
});

describe("determineCourseUrl() - Regex Edge Cases", () => {
  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  describe("WHEN input matches URL regex", () => {
    it("shall detect URL with protocol and TLD", () => {
      const result = determineCourseUrl("https://example.com");

      expect(result.courseId).toBe("https://example.com");
      expect(result.courseUrl).toBe("https://example.com");
    });

    it("shall detect URL without protocol but with TLD", () => {
      const result = determineCourseUrl("example.com");

      expect(result.courseId).toBe("example.com");
      expect(result.courseUrl).toBe("example.com");
    });

    it("shall detect URL with subdomain", () => {
      const result = determineCourseUrl("sub.example.com");

      expect(result.courseId).toBe("sub.example.com");
      expect(result.courseUrl).toBe("sub.example.com");
    });

    it("shall detect URL with port", () => {
      const result = determineCourseUrl("example.com:8080");

      expect(result.courseId).toBe("example.com:8080");
      expect(result.courseUrl).toBe("example.com:8080");
    });

    it("shall detect URL with path segments", () => {
      const result = determineCourseUrl("example.com/path/to/course");

      expect(result.courseId).toBe("example.com/path/to/course");
      expect(result.courseUrl).toBe("example.com/path/to/course");
    });

    it("shall detect Netlify URL and extract courseId", () => {
      const result = determineCourseUrl("my-course.netlify.app");

      expect(result.courseId).toBe("my-course");
      expect(result.courseUrl).toBe("my-course.netlify.app");
    });

    it("shall detect Netlify URL with https protocol", () => {
      const result = determineCourseUrl("https://my-course.netlify.app");

      expect(result.courseId).toBe("https://my-course");
      expect(result.courseUrl).toBe("https://my-course.netlify.app");
    });
  });

  describe("WHEN input does NOT match URL regex", () => {
    it("shall treat plain text as courseId", () => {
      const result = determineCourseUrl("simple-course");

      expect(result.courseId).toBe("simple-course");
      expect(result.courseUrl).toBe("simple-course.netlify.app");
    });

    it("shall treat text without TLD as courseId", () => {
      const result = determineCourseUrl("my-course-123");

      expect(result.courseId).toBe("my-course-123");
      expect(result.courseUrl).toBe("my-course-123.netlify.app");
    });
  });

  describe("WHEN input starts with 192 or localhost", () => {
    it("shall set protocol to http:// for 192.x.x.x", () => {
      const result = determineCourseUrl("192.168.1.1");

      expect(result.courseId).toBe("192.168.1.1");
      expect(result.courseUrl).toBe("192.168.1.1");
      expect(courseProtocol.value).toBe("http://");
    });

    it("shall set protocol to http:// for 192.x.x.x with port", () => {
      const result = determineCourseUrl("192.168.1.100:3000");

      expect(result.courseId).toBe("192.168.1.100:3000");
      expect(courseProtocol.value).toBe("http://");
    });

    it("shall set protocol to http:// for localhost", () => {
      const result = determineCourseUrl("localhost");

      expect(result.courseId).toBe("localhost");
      expect(result.courseUrl).toBe("localhost");
      expect(courseProtocol.value).toBe("http://");
    });

    it("shall set protocol to http:// for localhost with port", () => {
      const result = determineCourseUrl("localhost:3000");

      expect(result.courseId).toBe("localhost:3000");
      expect(courseProtocol.value).toBe("http://");
    });
  });

  describe("WHEN input does NOT start with 192 or localhost", () => {
    it("shall not change protocol for regular domains", () => {
      courseProtocol.value = "https://";

      const result = determineCourseUrl("example.com");

      expect(courseProtocol.value).toBe("https://");
    });

    it("shall not change protocol for plain courseIds", () => {
      courseProtocol.value = "https://";

      const result = determineCourseUrl("my-course");

      expect(courseProtocol.value).toBe("https://");
    });
  });
});

describe("injectCourseUrl() - Type-Specific Conditionals", () => {
  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  describe('WHEN lo.type equals "archive"', () => {
    it("shall use archive-specific route construction", () => {
      const los: Lo[] = [
        {
          type: "archive",
          title: "Archive",
          route: "/archive/{{COURSEURL}}",
          archiveFile: "course.zip"
        } as any
      ];

      injectCourseUrl(los, "test", "example.com");

      expect(los[0].route).toBe("https://example.com/course.zip");
      expect(los[0].route).toContain(los[0].archiveFile);
    });
  });

  describe('WHEN lo.type does NOT equal "archive"', () => {
    it("shall use standard route replacement for topic", () => {
      const los: Lo[] = [
        {
          type: "topic",
          title: "Topic",
          route: "/topic/{{COURSEURL}}/intro"
        } as any
      ];

      injectCourseUrl(los, "course-id", "example.com");

      expect(los[0].route).toBe("/topic/course-id/intro");
    });

    it("shall use standard route replacement for lab", () => {
      const los: Lo[] = [
        {
          type: "lab",
          title: "Lab",
          route: "/lab/{{COURSEURL}}/lab1",
          pdf: "https://{{COURSEURL}}/lab.pdf"
        } as any
      ];

      injectCourseUrl(los, "course-id", "example.com");

      expect(los[0].route).toBe("/lab/course-id/lab1");
      expect((los[0] as any).pdf).toBe("https://example.com/lab.pdf");
    });
  });

  describe('WHEN lo.type equals "talk" (with ==, not ===)', () => {
    it("shall process pdf for talk type", () => {
      const los: Lo[] = [
        {
          type: "talk",
          title: "Talk",
          route: "/talk/test",
          pdf: "https://{{COURSEURL}}/talk.pdf"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBe("https://test.com/talk.pdf");
    });
  });

  describe('WHEN lo.type equals "lab" (with ==, not ===)', () => {
    it("shall process pdf for lab type", () => {
      const los: Lo[] = [
        {
          type: "lab",
          title: "Lab",
          route: "/lab/test",
          pdf: "https://{{COURSEURL}}/lab.pdf"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBe("https://test.com/lab.pdf");
    });
  });

  describe('WHEN lo.type equals "tutorial" (with ===)', () => {
    it("shall check if tutorial.pdf exists before replacing", () => {
      const los: Lo[] = [
        {
          type: "tutorial",
          title: "Tutorial",
          route: "/tutorial/test",
          pdf: "https://{{COURSEURL}}/tut.pdf"
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBe("https://test.com/tut.pdf");
    });

    it("shall skip pdf replacement when tutorial.pdf is undefined", () => {
      const los: Lo[] = [
        {
          type: "tutorial",
          title: "Tutorial",
          route: "/tutorial/test"
          // pdf is undefined
        } as any
      ];

      injectCourseUrl(los, "test", "test.com");

      expect((los[0] as any).pdf).toBeUndefined();
    });
  });
});
