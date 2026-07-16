import { describe, it, expect, beforeEach } from "vitest";
import { LiveLab } from "$lib/services/course/services/live-lab";

const lab = {
  type: "lab",
  title: "Test Lab",
  shortTitle: "lab-01",
  route: "/lab/test-course/lab-01",
  los: [
    { shortTitle: "Step01", title: "# Introduction", contentHtml: "<p>Intro</p>" },
    { shortTitle: "Step02", title: "# Setup", contentHtml: "<p>Setup</p>" },
    { shortTitle: "Step03", title: "# Exercise", contentHtml: "<p>Exercise</p>" }
  ]
} as any;

const course = {
  courseId: "test-course",
  areLabStepsAutoNumbered: false
} as any;

function freshLab() {
  return {
    ...lab,
    los: lab.los.map((step: any) => ({ ...step }))
  };
}

describe("LiveLab", () => {
  let liveLab: LiveLab;

  beforeEach(() => {
    liveLab = new LiveLab(course, freshLab(), "/lab/test-course/lab-01");
  });

  describe("constructor", () => {
    it("initializes steps from lab.los shortTitles", () => {
      expect(liveLab.steps).toEqual([
        encodeURI("Step01"),
        encodeURI("Step02"),
        encodeURI("Step03")
      ]);
    });

    it("sets autoNumber from course.areLabStepsAutoNumbered", () => {
      expect(liveLab.autoNumber).toBe(false);
    });

    it("sets autoNumber to true when course has it enabled", () => {
      const autoNumberCourse = { ...course, areLabStepsAutoNumbered: true } as any;
      const autoLab = new LiveLab(autoNumberCourse, freshLab(), "/lab/test-course/lab-01");
      expect(autoLab.autoNumber).toBe(true);
    });

    it("stores the url from labId parameter", () => {
      expect(liveLab.url).toBe("/lab/test-course/lab-01");
    });
  });

  describe("setFirstPageActive", () => {
    it("sets currentChapterShortTitle to the encoded first step", () => {
      liveLab.setFirstPageActive();
      expect(liveLab.currentChapterShortTitle).toBe(encodeURI("Step01"));
    });

    it("sets index to 0", () => {
      liveLab.setFirstPageActive();
      expect(liveLab.index).toBe(0);
    });

    it("sets content to the first step HTML", () => {
      liveLab.setFirstPageActive();
      expect(liveLab.content).toBe("<p>Intro</p>");
    });
  });

  describe("setCurrentChapter", () => {
    it("sets chapter title and content for a valid step", () => {
      liveLab.setCurrentChapter(encodeURI("Step02"));
      expect(liveLab.currentChapterShortTitle).toBe(encodeURI("Step02"));
      expect(liveLab.currentChapterTitle).toBe(" Setup");
      expect(liveLab.content).toBe("<p>Setup</p>");
    });

    it("updates the index to match the step position", () => {
      liveLab.setCurrentChapter(encodeURI("Step03"));
      expect(liveLab.index).toBe(2);
    });

    it("does nothing for an invalid step", () => {
      liveLab.setFirstPageActive();
      const prevTitle = liveLab.currentChapterShortTitle;
      const prevContent = liveLab.content;

      liveLab.setCurrentChapter("NonExistentStep");

      expect(liveLab.currentChapterShortTitle).toBe(prevTitle);
      expect(liveLab.content).toBe(prevContent);
    });
  });

  describe("nextStep", () => {
    it("returns the next step name", () => {
      liveLab.setCurrentChapter(encodeURI("Step01"));
      expect(liveLab.nextStep()).toBe(encodeURI("Step02"));
    });

    it("returns empty string at the last step", () => {
      liveLab.setCurrentChapter(encodeURI("Step03"));
      expect(liveLab.nextStep()).toBe("");
    });
  });

  describe("prevStep", () => {
    it("returns the previous step name", () => {
      liveLab.setCurrentChapter(encodeURI("Step02"));
      expect(liveLab.prevStep()).toBe(encodeURI("Step01"));
    });

    it("returns empty string at the first step", () => {
      liveLab.setCurrentChapter(encodeURI("Step01"));
      expect(liveLab.prevStep()).toBe("");
    });
  });

  describe("refreshNav", () => {
    it("generates navbarHtml containing links with step titles", () => {
      liveLab.setFirstPageActive();
      liveLab.refreshNav();

      expect(liveLab.navbarHtml).toContain(encodeURI("Step01"));
      expect(liveLab.navbarHtml).toContain(encodeURI("Step02"));
      expect(liveLab.navbarHtml).toContain(encodeURI("Step03"));
      expect(liveLab.navbarHtml).toContain("<a href=");
      expect(liveLab.navbarHtml).toContain("Introduction");
      expect(liveLab.navbarHtml).toContain("Setup");
      expect(liveLab.navbarHtml).toContain("Exercise");
    });

    it("marks the active step with font-bold class", () => {
      liveLab.setCurrentChapter(encodeURI("Step02"));
      liveLab.refreshNav();

      // The active chapter should have font-bold styling
      expect(liveLab.navbarHtml).toContain("font-bold");
    });
  });

  describe("convertMdToHtml", () => {
    it("populates chaptersHtml map with encoded shortTitle keys", () => {
      expect(liveLab.chaptersHtml.size).toBe(3);
      expect(liveLab.chaptersHtml.get(encodeURI("Step01"))).toBe("<p>Intro</p>");
      expect(liveLab.chaptersHtml.get(encodeURI("Step02"))).toBe("<p>Setup</p>");
      expect(liveLab.chaptersHtml.get(encodeURI("Step03"))).toBe("<p>Exercise</p>");
    });

    it("populates chaptersTitles map with leading hashes removed", () => {
      expect(liveLab.chaptersTitles.size).toBe(3);
      expect(liveLab.chaptersTitles.get("Step01")).toBe(" Introduction");
      expect(liveLab.chaptersTitles.get("Step02")).toBe(" Setup");
      expect(liveLab.chaptersTitles.get("Step03")).toBe(" Exercise");
    });
  });
});
