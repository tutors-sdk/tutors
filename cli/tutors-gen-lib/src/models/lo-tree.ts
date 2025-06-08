import { isCompositeLo, type Course, type IconType, type Lo, type Panels, type Composite, type LoType, type Lab, type Units, type Unit, type Side } from "./lo-types";
import { convertLoToHtml } from "./markdown-utils";
import { allVideoLos, createCompanions, createToc, createWallBar, filterByType, fixRoutePaths, flattenLos, initCalendar, injectCourseUrl, loadPropertyFlags } from "./lo-utils";

export function decorateCourseTree(course: Course, courseId: string = "", courseUrl = "") {
  course.courseId = courseId;
  course.courseUrl = courseUrl;
  course.route = `/course/${courseId}`;
  injectCourseUrl(course, courseId, courseUrl);
  decorateLoTree(course, course);

  course.walls = [];
  course.wallMap = new Map<string, Lo[]>();
  ["talk", "note", "lab", "web", "archive", "github"].forEach((type) => addWall(course, type as LoType));

  const los = flattenLos(course.los);
  los.forEach((lo) => fixRoutePaths(lo));
  course.loIndex = new Map<string, Lo>();
  los.forEach((lo) => course.loIndex.set(lo.route, lo));
  const videoLos = allVideoLos(los);
  videoLos.forEach((lo) => course.loIndex.set(lo.video, lo));
  createCompanions(course);
  createWallBar(course);
  createToc(course);
  loadPropertyFlags(course);
  initCalendar(course);
}

export function decorateLoTree(course: Course, lo: Lo) {
  lo.icon = getIcon(lo);
  lo.parentCourse = course;
  lo.breadCrumbs = [];
  crumbs(lo, lo.breadCrumbs);
  // convertLoToHtml(course, lo);
  if (isCompositeLo(lo)) {
    const compositeLo = lo as Composite;
    compositeLo.panels = getPanels(compositeLo.los);
    compositeLo.units = getUnits(compositeLo.los);
    for (const childLo of compositeLo.los) {
      childLo.parentLo = lo;
      if (compositeLo.los) {
        decorateLoTree(course, childLo);
      }
    }
  }
}

function getPanels(los: Lo[]): Panels {
  return {
    panelVideos: los?.filter((lo) => lo.type === "panelvideo"),
    panelTalks: los?.filter((lo) => lo.type === "paneltalk"),
    panelNotes: los?.filter((lo) => lo.type === "panelnote"),
  };
}

function getUnits(los: Lo[]): Units {
  let standardLos = los?.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "panelnote" && lo.type !== "side");
  standardLos = sortLos(standardLos);
  return {
    units: los?.filter((lo) => lo.type === "unit") as Unit[],
    sides: los?.filter((lo) => lo.type === "side") as Side[],
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

function addWall(course: Course, type: LoType) {
  const los = filterByType(course.los, type);
  if (los.length > 0) {
    course.walls?.push(filterByType(course.los, type));
  }
  if (los.length > 0) {
    course.wallMap?.set(type, los);
  }
}
