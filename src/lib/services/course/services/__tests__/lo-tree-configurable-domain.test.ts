import { describe, it, expect, beforeEach } from "vitest";
import { determineCourseUrl } from "../lo-tree";
import { courseProtocol } from "$lib/runes.svelte";

describe("determineCourseUrl() with custom baseDomain", () => {
  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  describe("WHEN a plain course ID is provided with custom domain", () => {
    it("should construct URL using the custom domain suffix", () => {
      const result = determineCourseUrl("my-course", ".apps.ocp4.example.com");
      expect(result.courseId).toBe("my-course");
      expect(result.courseUrl).toBe("my-course.apps.ocp4.example.com");
    });

    it("should work with different domain suffixes", () => {
      const result = determineCourseUrl("web-dev-2024", ".courses.university.edu");
      expect(result.courseId).toBe("web-dev-2024");
      expect(result.courseUrl).toBe("web-dev-2024.courses.university.edu");
    });
  });

  describe("WHEN a full URL containing the custom domain is provided", () => {
    it("should strip the custom domain from courseId", () => {
      const result = determineCourseUrl("my-course.apps.ocp4.example.com", ".apps.ocp4.example.com");
      expect(result.courseId).toBe("my-course");
      expect(result.courseUrl).toBe("my-course.apps.ocp4.example.com");
    });

    it("should not strip domain if it does not match", () => {
      const result = determineCourseUrl("my-course.other-domain.com", ".apps.ocp4.example.com");
      expect(result.courseId).toBe("my-course.other-domain.com");
      expect(result.courseUrl).toBe("my-course.other-domain.com");
    });
  });

  describe("WHEN localhost is provided with custom domain", () => {
    it("should ignore the custom domain and use localhost directly", () => {
      const result = determineCourseUrl("localhost:3000", ".apps.ocp4.example.com");
      expect(result.courseId).toBe("localhost:3000");
      expect(result.courseUrl).toBe("localhost:3000");
      expect(courseProtocol.value).toBe("http://");
    });

    it("should ignore the custom domain for IP addresses", () => {
      const result = determineCourseUrl("192.168.1.100:8080", ".apps.ocp4.example.com");
      expect(result.courseId).toBe("192.168.1.100:8080");
      expect(result.courseUrl).toBe("192.168.1.100:8080");
      expect(courseProtocol.value).toBe("http://");
    });
  });

  describe("WHEN no baseDomain is provided", () => {
    it("should default to .netlify.app for plain course IDs", () => {
      const result = determineCourseUrl("my-course");
      expect(result.courseUrl).toBe("my-course.netlify.app");
    });
  });
});
