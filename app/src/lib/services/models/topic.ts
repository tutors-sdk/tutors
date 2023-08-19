import type { Lo } from "$lib/services/types/lo";
import { getSortedUnits } from "$lib/services/utils/lo";
import type { Course } from "$lib/services/models/course";

function fixRoutePaths(lo: Lo) {
  if (lo.route && lo.route[0] === "#") {
    lo.route = "/" + lo.route.slice(1);
  }
  if (lo.video && lo.video[0] === "#") {
    lo.video = "/" + lo.video.slice(1);
  }
  if (lo.route.endsWith("md") && lo.video) {
    lo.route = lo.video;
  }
  lo.los?.forEach(fixRoutePaths);
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
    const panelVideos = this.lo.los.filter((lo) => lo.type === "panelvideo");
    const panelTalks = this.lo.los.filter((lo) => lo.type === "paneltalk");
    const panelNotes = this.lo.los.filter((lo) => lo.type === "panelnote");
    const standardLos = this.lo.los.filter(
      (lo) =>
        lo.type !== "unit" &&
        lo.type !== "panelvideo" &&
        lo.type !== "paneltalk" &&
        lo.type !== "panelnote" &&
        lo.type !== "side"
    );

    this.toc.push(
      ...panelVideos,
      ...panelTalks,
      ...panelNotes,
      ...units,
      ...standardLos,
      ...sideBar
    );

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
