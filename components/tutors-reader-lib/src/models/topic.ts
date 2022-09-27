import type { Lo } from "../types/lo-types";
import { fixRoutes, getSortedUnits } from "../utils/lo-utils";
import type { Course } from "./course";

export class Topic {
  course: Course;
  lo: Lo;
  units: Lo[];
  panelVideos: Lo[];
  panelTalks: Lo[];
  standardLos: Lo[];
  toc: Lo[] = [];

  constructor(lo: Lo, courseUrl: string, course: Course) {
    this.lo = lo;
    this.course = course;

    this.units = getSortedUnits(this.lo.los);
    this.panelVideos = lo.los.filter((lo) => lo.type == "panelvideo");
    this.panelTalks = lo.los.filter((lo) => lo.type == "paneltalk");
    this.standardLos = lo.los.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk");

    this.toc.push(...this.panelVideos);
    this.toc.push(...this.panelTalks);
    this.toc.push(...this.units);
    this.toc.push(...this.standardLos);

    this.toc.forEach((lo) => {
      lo.parent = this;
      fixRoutes(lo);
      if (lo.type === "unit") {
        lo.los.forEach((subLo) => {
          subLo.parent = this;
          fixRoutes(subLo);
        });
      }
    });
    fixRoutes(lo);
  }
}
