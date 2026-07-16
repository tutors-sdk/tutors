import { describe, it, expect, beforeEach } from "vitest";
import { determineCourseUrl, injectCourseUrl } from "$lib/services/course/services/lo-tree";
import { courseProtocol } from "$lib/runes.svelte";
import { assertValid, isValid } from "../../../contracts/validators";
import { CourseUrlResultSchema } from "../../../contracts/schemas";

describe("determineCourseUrl", () => {
  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  it("returns Netlify subdomain for a plain course ID", () => {
    const result = determineCourseUrl("my-course");
    expect(result.courseId).toBe("my-course");
    expect(result.courseUrl).toBe("my-course.netlify.app");
  });

  it("strips .netlify.app from courseId for a full Netlify URL", () => {
    const result = determineCourseUrl("my-course.netlify.app");
    expect(result.courseId).toBe("my-course");
    expect(result.courseUrl).toBe("my-course.netlify.app");
  });

  it("uses the input as-is for a non-Netlify URL", () => {
    const result = determineCourseUrl("courses.example.com");
    expect(result.courseId).toBe("courses.example.com");
    expect(result.courseUrl).toBe("courses.example.com");
  });

  it("sets http protocol for localhost", () => {
    const result = determineCourseUrl("localhost:3000");
    expect(result.courseId).toBe("localhost:3000");
    expect(result.courseUrl).toBe("localhost:3000");
    expect(courseProtocol.value).toBe("http://");
  });

  it("sets http protocol for 192.x IP address", () => {
    const result = determineCourseUrl("192.168.1.5:3000");
    expect(result.courseId).toBe("192.168.1.5:3000");
    expect(result.courseUrl).toBe("192.168.1.5:3000");
    expect(courseProtocol.value).toBe("http://");
  });

  it("returns a result matching CourseUrlResultSchema", () => {
    const result = determineCourseUrl("schema-test");
    expect(isValid(CourseUrlResultSchema, result)).toBe(true);
    const parsed = assertValid(CourseUrlResultSchema, result);
    expect(parsed.courseId).toBe("schema-test");
    expect(parsed.courseUrl).toBe("schema-test.netlify.app");
  });
});

describe("injectCourseUrl", () => {
  const courseId = "test-course";
  const courseUrl = "test-course.netlify.app";

  beforeEach(() => {
    courseProtocol.value = "https://";
  });

  it("replaces {{COURSEURL}} in lo.route with courseId", () => {
    const los = [
      {
        type: "topic",
        route: "/topic/{{COURSEURL}}/topic-01",
        img: "",
        video: ""
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);
    expect(los[0].route).toBe("/topic/test-course/topic-01");
  });

  it("replaces {{COURSEURL}} in lo.img with courseUrl", () => {
    const los = [
      {
        type: "topic",
        route: "/topic/{{COURSEURL}}/topic-01",
        img: "https://{{COURSEURL}}/img/topic.png",
        video: ""
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);
    expect(los[0].img).toBe("https://test-course.netlify.app/img/topic.png");
  });

  it("constructs full archive URL for archive type", () => {
    const los = [
      {
        type: "archive",
        route: "/archive/{{COURSEURL}}/topic-01/archive-01",
        img: "",
        video: "",
        archiveFile: "archive.zip"
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);
    expect(los[0].route).toBe("https://test-course.netlify.app/topic-01/archive-01/archive.zip");
  });

  it("replaces {{COURSEURL}} in talk pdf with courseUrl", () => {
    const los = [
      {
        type: "talk",
        route: "/talk/{{COURSEURL}}/topic-01/talk-01",
        img: "",
        video: "",
        pdf: "https://{{COURSEURL}}/topic-01/talk-01/talk-01.pdf"
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);
    expect(los[0].pdf).toBe("https://test-course.netlify.app/topic-01/talk-01/talk-01.pdf");
  });

  it("replaces {{COURSEURL}} in lab pdf with courseUrl", () => {
    const los = [
      {
        type: "lab",
        route: "/lab/{{COURSEURL}}/topic-01/lab-01",
        img: "",
        video: "",
        pdf: "https://{{COURSEURL}}/topic-01/lab-01/lab-01.pdf"
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);
    expect(los[0].pdf).toBe("https://test-course.netlify.app/topic-01/lab-01/lab-01.pdf");
  });

  it("processes multiple LOs in a single array", () => {
    const los = [
      {
        type: "topic",
        route: "/topic/{{COURSEURL}}/topic-01",
        img: "https://{{COURSEURL}}/img/topic1.png",
        video: ""
      },
      {
        type: "talk",
        route: "/talk/{{COURSEURL}}/topic-01/talk-01",
        img: "https://{{COURSEURL}}/img/talk1.png",
        video: "{{COURSEURL}}/video/talk1",
        pdf: "https://{{COURSEURL}}/talk-01.pdf"
      },
      {
        type: "lab",
        route: "/lab/{{COURSEURL}}/topic-01/lab-01",
        img: "",
        video: "",
        pdf: "https://{{COURSEURL}}/lab-01.pdf"
      }
    ] as any[];

    injectCourseUrl(los, courseId, courseUrl);

    expect(los[0].route).toBe("/topic/test-course/topic-01");
    expect(los[0].img).toBe("https://test-course.netlify.app/img/topic1.png");
    expect(los[1].route).toBe("/talk/test-course/topic-01/talk-01");
    expect(los[1].video).toBe("test-course/video/talk1");
    expect(los[1].pdf).toBe("https://test-course.netlify.app/talk-01.pdf");
    expect(los[2].route).toBe("/lab/test-course/topic-01/lab-01");
    expect(los[2].pdf).toBe("https://test-course.netlify.app/lab-01.pdf");
  });
});
