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
  toc: Lo[] = [];

  constructor(lo: Lo, courseUrl: string, course: Course) {
    this.lo = lo;
    this.course = course;

    const units = getSortedUnits(this.lo.los);
    const sideBar = this.lo.los.filter((lo) => lo.type === "side");
    const panelVideos = lo.los.filter((lo) => lo.type == "panelvideo");
    const panelTalks = lo.los.filter((lo) => lo.type == "paneltalk");
    const panelNotes = lo.los.filter((lo) => lo.type == "panelnote");
    const standardLos = lo.los.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "panelnote" && lo.type !== "side");

    this.toc.push(...panelVideos);
    this.toc.push(...panelTalks);
    this.toc.push(...panelNotes);
    this.toc.push(...units);
    this.toc.push(...standardLos);
    this.toc.push(...sideBar);

    fixRoutePaths(lo);
    this.toc.forEach((lo) => {
      lo.parent = this;
      if (lo.type === "unit" || lo.type === "side") {
        lo.los.forEach((subLo) => {
          subLo.parent = this;
        });
      }
    });
  }
}
