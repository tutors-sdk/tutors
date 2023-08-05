import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
import { convertMdToHtml } from "./markdown";

export function buildCourseTree(parent: LearningObject) {
  for (const lo of parent.los) {
    if (lo.contentMd) {
      lo.contentHtml = convertMdToHtml(lo.contentMd);
    }
    const obj = lo as LearningObject;
    obj.parentLo = parent;
    if (obj.frontMatter && obj.frontMatter.icon) {
      obj.icon = {
        type: obj.frontMatter.icon["type"],
        color: obj.frontMatter.icon["color"],
      };
    } else {
      obj.icon = null;
    }
    if (obj.los) {
      obj.panels = getPanels(obj.los);
      obj.units = getUnits(obj.los);
      buildCourseTree(obj);
    }
  }
}

export function getPanels(los: any): any {
  return {
    panelVideos: los?.filter((lo: any) => lo.type === "panelvideo"),
    panelTalks: los?.filter((lo: any) => lo.type === "paneltalk"),
    panelNotes: los?.filter((lo: any) => lo.type === "panelnote"),
  };
}

export function getUnits(los: any): any {
  let standardLos = los?.filter((lo: any) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "side");
  standardLos = sortLos(standardLos);
  return {
    units: los?.filter((lo: any) => lo.type === "unit"),
    sides: los?.filter((lo: any) => lo.type === "side"),
    standardLos: standardLos,
  };
}

export function sortLos(los: Array<LearningObject>): LearningObject[] {
  const orderedLos = los.filter((lo) => lo.frontMatter?.order);
  const unOrderedLos = los.filter((lo) => !lo.frontMatter?.order);
  orderedLos.sort((a: any, b: any) => a.frontMatter.order - b.frontMatter.order);
  return orderedLos.concat(unOrderedLos);
}
