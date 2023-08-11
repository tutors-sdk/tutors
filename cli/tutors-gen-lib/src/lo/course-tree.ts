import { IconType, Lo, Panels } from "./lo-types";
import { convertMdToHtml } from "../utils/markdown";

let rootCourse: Lo;

export function decorateCourseTree(lo: Lo) {
  if (lo.type === "course") {
    rootCourse = lo;
  }
  lo.contentHtml = convertMdToHtml(lo?.contentMd);
  lo.summary = convertMdToHtml(lo?.summary);
  lo.icon = getIcon(lo);
  lo.parentCourse = rootCourse;
  lo.breadCrumbs = [];
  crumbs(lo, lo.breadCrumbs);
  if (lo.los) {
    lo.panels = getPanels(lo.los);
    lo.units = getUnits(lo.los);
    for (const childLo of lo.los) {
      childLo.parentLo = lo;
      if (lo.los) {
        decorateCourseTree(childLo as Lo);
      }
    }
  }
}

function getPanels(los: Lo[]): Panels {
  return {
    panelVideos: los?.filter((lo: Lo) => lo.type === "panelvideo"),
    panelTalks: los?.filter((lo: Lo) => lo.type === "paneltalk"),
    panelNotes: los?.filter((lo: Lo) => lo.type === "panelnote"),
  };
}

function getUnits(los: Lo[]) {
  let standardLos = los?.filter((lo: any) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "panelnote" && lo.type !== "side");
  standardLos = sortLos(standardLos);
  return {
    units: los?.filter((lo: any) => lo.type === "unit"),
    sides: los?.filter((lo: any) => lo.type === "side"),
    standardLos: standardLos,
  };
}

function sortLos(los: Array<Lo>): Lo[] {
  const orderedLos = los.filter((lo) => lo.frontMatter?.order);
  const unOrderedLos = los.filter((lo) => !lo.frontMatter?.order);
  orderedLos.sort((a: any, b: any) => a.frontMatter.order - b.frontMatter.order);
  return orderedLos.concat(unOrderedLos);
}

function getIcon(lo: Lo): IconType | undefined {
  if (lo.frontMatter && lo.frontMatter.icon) {
    return {
      // @ts-ignore
      type: lo.frontMatter.icon["type"],
      // @ts-ignore
      color: lo.frontMatter.icon["color"],
    };
  }
  return undefined;
}

function crumbs(lo: Lo | undefined, los: Lo[]) {
  if (lo) {
    crumbs(lo.parentLo, los);
    los.push(lo);
  }
}
