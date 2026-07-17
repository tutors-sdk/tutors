import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { courseService } from "$lib/services/course/services/course.svelte";
import { courseProtocol } from "$lib/runes.svelte";

describe("Course Service - Error Handling", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    courseService.courses.clear();
    courseProtocol.value = "https://";
    mockFetch = vi.fn();

    // Suppress console.error during error tests to reduce noise
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("WHEN fetch response is not ok", () => {
    it("shall throw error with status code 400", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(courseService.getOrLoadCourse("bad-course", mockFetch)).rejects.toThrow("Fetch failed with status 400");
    });

    it("shall throw error with status code 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(courseService.getOrLoadCourse("error-course", mockFetch)).rejects.toThrow("Fetch failed with status 500");
    });

    it("shall throw error with status code 403", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403
      });

      await expect(courseService.getOrLoadCourse("forbidden-course", mockFetch)).rejects.toThrow("Fetch failed with status 403");
    });
  });

  describe("WHEN JSON parsing fails", () => {
    it("shall propagate JSON parse errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        }
      });

      await expect(courseService.getOrLoadCourse("malformed-course", mockFetch)).rejects.toThrow("Invalid JSON");
    });
  });

  describe("WHEN fetch itself fails", () => {
    it("shall propagate network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

      await expect(courseService.getOrLoadCourse("offline-course", mockFetch)).rejects.toThrow("Network timeout");
    });

    it("shall propagate DNS resolution errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("DNS lookup failed"));

      await expect(courseService.getOrLoadCourse("unknown-domain", mockFetch)).rejects.toThrow("DNS lookup failed");
    });
  });

  describe("WHEN course has minimal data", () => {
    it("shall cache and return course with only required fields", async () => {
      const minimalCourse = {
        title: "Minimal",
        los: [] // Minimum required structure
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => minimalCourse
      });

      const course = await courseService.getOrLoadCourse("minimal-course", mockFetch);

      // Should cache and decorate even minimal course
      expect(courseService.courses.has("minimal-course")).toBe(true);
      expect(course.title).toBe("Minimal");
      expect(course.courseId).toBe("minimal-course");
    });
  });
});

describe("Course Service - Cache Behavior", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const mockCourse = {
    title: "Test Course",
    los: [],
    topicIndex: new Map(),
    labIndex: new Map()
  };

  beforeEach(() => {
    courseService.courses.clear();
    courseProtocol.value = "https://";
    mockFetch = vi.fn();
  });

  describe("WHEN course is in cache", () => {
    it("shall not call fetch function", async () => {
      // Pre-populate cache
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });
      await courseService.getOrLoadCourse("cached-course", mockFetch);

      // Clear mock call history
      mockFetch.mockClear();

      // Request again
      await courseService.getOrLoadCourse("cached-course", mockFetch);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("shall return identical object on multiple calls", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });

      const course1 = await courseService.getOrLoadCourse("test", mockFetch);
      const course2 = await courseService.getOrLoadCourse("test", mockFetch);
      const course3 = await courseService.getOrLoadCourse("test", mockFetch);

      expect(course1).toBe(course2);
      expect(course2).toBe(course3);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("WHEN multiple different courses are requested", () => {
    it("shall maintain separate cache entries", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: "Course A" })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: "Course B" })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: "Course C" })
        });

      await courseService.getOrLoadCourse("course-a", mockFetch);
      await courseService.getOrLoadCourse("course-b", mockFetch);
      await courseService.getOrLoadCourse("course-c", mockFetch);

      expect(courseService.courses.size).toBe(3);
      expect(courseService.courses.get("course-a")?.title).toBe("Course A");
      expect(courseService.courses.get("course-b")?.title).toBe("Course B");
      expect(courseService.courses.get("course-c")?.title).toBe("Course C");
    });
  });
});
