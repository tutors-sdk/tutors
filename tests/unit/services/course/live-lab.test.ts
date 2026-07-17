import { LiveLab } from "$lib/services/course/services/live-lab";
import { createCourse, resetCourseCounter } from "../../../fixtures/course-factory";
import { createLabWithSteps } from "../../../fixtures/lo-factory";

function makeLiveLab(stepTitles: string[], autoNumber = false) {
  resetCourseCounter();
  const course = createCourse({ areLabStepsAutoNumbered: autoNumber }) as any;
  const lab = createLabWithSteps(stepTitles) as any;
  return new LiveLab(course, lab, "/lab/test-course/lab-01");
}

describe("LiveLab", () => {
  describe("constructor and initialization", () => {
    it("populates steps from lab los", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      expect(liveLab.steps).toHaveLength(2);
    });

    it("creates chaptersHtml map from los", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      expect(liveLab.chaptersHtml.size).toBe(2);
    });

    it("creates chaptersTitles map from los", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      expect(liveLab.chaptersTitles.size).toBe(2);
    });

    it("sets autoNumber from course property", () => {
      const liveLab = makeLiveLab(["Intro"], true);
      expect(liveLab.autoNumber).toBe(true);
    });

    it("sets url from labId parameter", () => {
      const liveLab = makeLiveLab(["Intro"]);
      expect(liveLab.url).toBe("/lab/test-course/lab-01");
    });
  });

  describe("setFirstPageActive", () => {
    it("sets current chapter to first step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setFirstPageActive();
      expect(liveLab.index).toBe(0);
      expect(liveLab.content).toContain("Intro");
    });
  });

  describe("setCurrentChapter", () => {
    it("sets content for valid step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setCurrentChapter("Step01");
      expect(liveLab.content).toContain("Intro");
    });

    it("does nothing for invalid step", () => {
      const liveLab = makeLiveLab(["Intro"]);
      liveLab.setCurrentChapter("NonExistent");
      expect(liveLab.content).toBe("");
    });

    it("updates the index correctly", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise", "Summary"]);
      liveLab.setCurrentChapter("Step02");
      expect(liveLab.index).toBe(1);
    });
  });

  describe("nextStep", () => {
    it("returns next step when not at end", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise", "Summary"]);
      liveLab.setFirstPageActive();
      expect(liveLab.nextStep()).toBe("Step02");
    });

    it("returns empty string at last step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setCurrentChapter("Step02");
      expect(liveLab.nextStep()).toBe("");
    });
  });

  describe("prevStep", () => {
    it("returns previous step when not at beginning", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setCurrentChapter("Step02");
      expect(liveLab.prevStep()).toBe("Step01");
    });

    it("returns empty string at first step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setFirstPageActive();
      expect(liveLab.prevStep()).toBe("");
    });
  });

  describe("navigation HTML", () => {
    it("generates navbar HTML with step links", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setFirstPageActive();
      expect(liveLab.navbarHtml).toContain("Step01");
      expect(liveLab.navbarHtml).toContain("Step02");
    });

    it("marks active step with bold class", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setFirstPageActive();
      expect(liveLab.navbarHtml).toContain("font-bold");
    });

    it("generates horizontal navbar with next link on first step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setFirstPageActive();
      expect(liveLab.horizontalNavbarHtml).toContain("&rarr;");
      expect(liveLab.horizontalNavbarHtml).not.toContain("&larr;");
    });

    it("generates horizontal navbar with both prev and next in middle", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise", "Summary"]);
      liveLab.setCurrentChapter("Step02");
      expect(liveLab.horizontalNavbarHtml).toContain("&larr;");
      expect(liveLab.horizontalNavbarHtml).toContain("&rarr;");
    });

    it("generates horizontal navbar with only prev link on last step", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"]);
      liveLab.setCurrentChapter("Step02");
      expect(liveLab.horizontalNavbarHtml).toContain("&larr;");
      expect(liveLab.horizontalNavbarHtml).not.toContain("&rarr;");
    });

    it("includes step numbers when autoNumber is true", () => {
      const liveLab = makeLiveLab(["Intro", "Exercise"], true);
      liveLab.setFirstPageActive();
      expect(liveLab.navbarHtml).toContain("Step01:");
    });
  });
});
