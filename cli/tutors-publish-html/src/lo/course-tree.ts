import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
import { convertMdToHtml } from "./markdown";

export function buildCourseTree(lo: LearningObject) {
  lo.contentHtml = convertMdToHtml(lo?.contentMd);
  lo.summary = convertMdToHtml(lo?.summary);
  lo.icon = getIcon(lo);
  if (lo.los) {
    lo.panels = getPanels(lo.los);
    lo.units = getUnits(lo.los);
    for (const childLo of lo.los) {
      childLo.parentLo = lo;
      if (lo.los) {
        buildCourseTree(childLo as LearningObject);
      }
    }
  }
}

function getPanels(los: any) {
  return {
    panelVideos: los?.filter((lo: any) => lo.type === "panelvideo"),
    panelTalks: los?.filter((lo: any) => lo.type === "paneltalk"),
    panelNotes: los?.filter((lo: any) => lo.type === "panelnote"),
  };
}

function getUnits(los: any) {
  let standardLos = los?.filter((lo: any) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "side");
  standardLos = sortLos(standardLos);
  return {
    units: los?.filter((lo: any) => lo.type === "unit"),
    sides: los?.filter((lo: any) => lo.type === "side"),
    standardLos: standardLos,
  };
}

function sortLos(los: Array<LearningObject>): LearningObject[] {
  const orderedLos = los.filter((lo) => lo.frontMatter?.order);
  const unOrderedLos = los.filter((lo) => !lo.frontMatter?.order);
  orderedLos.sort((a: any, b: any) => a.frontMatter.order - b.frontMatter.order);
  return orderedLos.concat(unOrderedLos);
}

function getIcon(lo: LearningObject) {
  if (lo.frontMatter && lo.frontMatter.icon) {
    return {
      type: lo.frontMatter.icon["type"],
      color: lo.frontMatter.icon["color"],
    };
  }
  return null;
}
