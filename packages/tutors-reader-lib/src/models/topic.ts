import type { Lo } from "../types/lo-types";
import { getSortedUnits } from "../utils/lo-utils";
import type { Course } from "./course";

function fixRoutePaths(lo: Lo) {
  if (lo.route && lo.route[0] == "#") {
    lo.route = lo.route.slice(1);
    lo.route = "/" + lo.route;
  }
  if (lo.video && lo.video[0] == "#") {
    lo.video = lo.video.slice(1);
    lo.video = "/" + lo.video;
  }
  if (lo.route.endsWith("md") && lo.video) {
    lo.route = lo.video;
  }
  lo.los?.forEach((lo) => {
    fixRoutePaths(lo);
  });
}

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

    fixRoutePaths(lo);
    this.toc.forEach((lo) => {
      lo.parent = this;
      if (lo.type === "unit") {
        lo.los.forEach((subLo) => {
          subLo.parent = this;
        });
      }
    });
  }
}
