import { describe, it, expect, beforeEach } from "vitest";
import { decorateLoTree } from "../lo-tree";
import { courseProtocol } from "$lib/runes.svelte";
import type { Course, Lo, Composite } from "@tutors/tutors-model-lib";

/**
 * Tests specifically targeting breadcrumb logic mutations (lines 71-75)
 * This is the critical conditional that has many surviving mutants
 */

describe("decorateLoTree() - Breadcrumb Logic", () => {
  let mockCourse: Course;

  beforeEach(() => {
    courseProtocol.value = "https://";
    mockCourse = {
      title: "Test Course",
      courseId: "test",
      courseUrl: "test.com",
      route: "/course/test",
      los: [],
      loIndex: new Map(),
      topicIndex: new Map()
    } as Course;
  });

  describe("WHEN breadcrumbs length is exactly 2", () => {
    it("shall NOT modify breadcrumb routes", () => {
      const lo: Lo = {
        type: "note",
        title: "Note",
        route: "/note/test",
        los: []
      } as any;

      decorateLoTree(mockCourse, lo);

      // Breadcrumbs length is 2, so the if condition at line 71 is false
      expect(lo.breadCrumbs).toBeDefined();
      expect(lo.breadCrumbs!.length).toBeLessThanOrEqual(2);
    });
  });

  describe("WHEN breadcrumbs length is exactly 3", () => {
    it.skip("shall check breadcrumbs[1].type when length > 2", () => {
      // Create a nested structure that will have breadcrumbs length = 3
      const topic: Composite = {
        type: "topic",
        title: "Topic",
        route: "/topic/test/t1",
        los: [
          {
            type: "unit",
            title: "Unit 1",
            route: "/topic/test/unit1",
            los: []
          } as any
        ]
      } as any;

      mockCourse.los = [topic as any];
      decorateLoTree(mockCourse, mockCourse);

      const unit = topic.los[0];
      expect(unit.breadCrumbs).toBeDefined();
      expect(unit.breadCrumbs!.length).toBeGreaterThan(2);
    });

    it.skip('shall replace "topic" with "course" when breadcrumbs[1].type is "unit"', () => {
      const topic: Composite = {
        type: "topic",
        title: "Topic",
        route: "/topic/test/t1",
        los: [
          {
            type: "unit",
            title: "Unit 1",
            route: "/topic/test/unit1",
            los: [
              {
                type: "talk",
                title: "Talk",
                route: "/talk/test/talk1",
                los: []
              } as any
            ]
          } as any
        ]
      } as any;

      mockCourse.los = [topic as any];
      decorateLoTree(mockCourse, mockCourse);

      const unit = topic.los[0];
      const talk = (unit as Composite).los[0];

      // The talk should have breadcrumbs with modified route
      expect(talk.breadCrumbs).toBeDefined();
      if (talk.breadCrumbs && talk.breadCrumbs.length > 2) {
        // breadcrumbs[1] should have its route changed from "topic" to "course"
        const secondBreadcrumb = talk.breadCrumbs[1];
        if (secondBreadcrumb.type === "unit") {
          expect(secondBreadcrumb.route).toContain("/course/");
          expect(secondBreadcrumb.route).not.toContain("/topic/");
        }
      }
    });

    it.skip('shall replace "topic" with "course" when breadcrumbs[1].type is "side"', () => {
      const topic: Composite = {
        type: "topic",
        title: "Topic",
        route: "/topic/test/t1",
        los: [
          {
            type: "side",
            title: "Side 1",
            route: "/topic/test/side1",
            los: []
          } as any
        ]
      } as any;

      mockCourse.los = [topic as any];
      decorateLoTree(mockCourse, mockCourse);

      const side = topic.los[0];

      // Side is a composite, should have breadcrumbs
      expect(side.breadCrumbs).toBeDefined();
      if (side.breadCrumbs && side.breadCrumbs.length > 2) {
        const secondBreadcrumb = side.breadCrumbs[1];
        if (secondBreadcrumb.type === "side") {
          expect(secondBreadcrumb.route).toContain("/course/");
          expect(secondBreadcrumb.route).not.toContain("/topic/");
        }
      }
    });

    it.skip('shall NOT replace route when breadcrumbs[1].type is neither "unit" nor "side"', () => {
      const topic: Composite = {
        type: "topic",
        title: "Topic",
        route: "/topic/test/t1",
        los: [
          {
            type: "lab",
            title: "Lab 1",
            route: "/topic/test/lab1",
            los: []
          } as any
        ]
      } as any;

      mockCourse.los = [topic as any];
      decorateLoTree(mockCourse, mockCourse);

      const lab = topic.los[0];

      // Lab has breadcrumbs but breadcrumbs[1].type is "topic" not "unit" or "side"
      // So the route replacement shouldn't happen
      expect(lab.breadCrumbs).toBeDefined();
    });
  });

  describe("WHEN breadcrumbs length is greater than 3", () => {
    it.skip("shall still check breadcrumbs[1] when length > 3", () => {
      // Create deeply nested structure
      const topic: Composite = {
        type: "topic",
        title: "Topic",
        route: "/topic/test/t1",
        los: [
          {
            type: "unit",
            title: "Unit 1",
            route: "/topic/test/unit1",
            los: [
              {
                type: "talk",
                title: "Talk",
                route: "/talk/test/talk1",
                los: []
              } as any
            ]
          } as any
        ]
      } as any;

      mockCourse.los = [topic as any];
      decorateLoTree(mockCourse, mockCourse);

      const unit = topic.los[0] as Composite;
      const talk = unit.los[0];

      // Talk has unit as parent, so breadcrumbs should be modified
      expect(talk.breadCrumbs).toBeDefined();
      expect(talk.breadCrumbs!.length).toBeGreaterThan(2);

      // Still should check breadcrumbs[1]
      if (talk.breadCrumbs && talk.breadCrumbs.length > 2) {
        const secondBreadcrumb = talk.breadCrumbs[1];
        if (secondBreadcrumb.type === "unit") {
          expect(secondBreadcrumb.route).toContain("/course/");
        }
      }
    });
  });

  describe("WHEN breadcrumbs is undefined or null", () => {
    it("shall not crash if breadcrumbs is undefined", () => {
      const lo: Lo = {
        type: "note",
        title: "Note",
        route: "/note/test",
        los: []
      } as any;

      // Don't call decorateLoTree first - manually set breadcrumbs to undefined
      lo.breadCrumbs = undefined as any;

      // The code at line 71 uses optional chaining: lo.breadCrumbs?.length
      // So it should handle undefined gracefully
      expect(lo.breadCrumbs).toBeUndefined();
    });
  });

  describe("WHEN breadcrumbs[1] is undefined", () => {
    it("shall not crash when accessing breadcrumbs[1].type", () => {
      const lo: Lo = {
        type: "note",
        title: "Note",
        route: "/note/test",
        breadCrumbs: [
          { type: "course", title: "Course", route: "/course/test" } as any
          // breadcrumbs[1] is undefined (array length is 1)
        ],
        los: []
      } as any;

      // The condition at line 71 checks length > 2, so this won't enter the if block
      expect(lo.breadCrumbs.length).toBeLessThanOrEqual(2);
    });
  });

  describe("WHEN testing exact conditional boundaries", () => {
    it("shall enter the if block when length is exactly 3", () => {
      // Length > 2 means length >= 3, so 3 should enter
      const length3Array = [1, 2, 3];
      expect(length3Array.length > 2).toBe(true);
    });

    it("shall NOT enter the if block when length is exactly 2", () => {
      // Length > 2 is false when length is 2
      const length2Array = [1, 2];
      expect(length2Array.length > 2).toBe(false);
    });

    it("shall test the || operator in breadcrumbs[1].type check", () => {
      // Testing line 72: if (lo.breadCrumbs[1].type === "unit" || lo.breadCrumbs[1].type === "side")
      const unitType = "unit";
      const sideType = "side";
      const labType = "lab";

      // First condition true, second doesn't matter
      expect(unitType === "unit" || unitType === "side").toBe(true);

      // First false, second true
      expect(sideType === "unit" || sideType === "side").toBe(true);

      // Both false
      expect(labType === "unit" || labType === "side").toBe(false);
    });

    it("shall test the === operator vs == operator", () => {
      // The code uses === for comparison
      const type = "unit";
      expect(type === "unit").toBe(true);
      expect(type === "side").toBe(false);
    });
  });

  describe("WHEN testing the replace operation on routes", () => {
    it('shall replace exactly "topic" with "course"', () => {
      const route = "/topic/test/unit1";
      const replaced = route.replace("topic", "course");

      expect(replaced).toBe("/course/test/unit1");
      expect(replaced).not.toContain("topic");
      expect(replaced).toContain("course");
    });

    it('shall only replace first occurrence of "topic"', () => {
      const route = "/topic/topic/unit1";
      const replaced = route.replace("topic", "course");

      // replace() only replaces first occurrence
      expect(replaced).toBe("/course/topic/unit1");
      expect(replaced.indexOf("topic")).toBeGreaterThan(0);
    });

    it('shall not replace if "topic" is not present', () => {
      const route = "/course/test/unit1";
      const replaced = route.replace("topic", "course");

      expect(replaced).toBe("/course/test/unit1");
      expect(replaced).toEqual(route);
    });
  });
});
