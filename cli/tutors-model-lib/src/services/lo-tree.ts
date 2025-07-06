import { isCompositeLo } from "../types/type-utils.ts";
import type { Composite, Course, Lo, Topic } from "../types/index.ts";
import { allVideoLos, crumbs, filterByType, flattenLos, getPanels, getUnits, injectCourseUrl, loadIcon, removeUnknownLos } from "../utils/lo-utils.ts";
import { createCompanions, createWalls, initCalendar, loadPropertyFlags } from "../utils/course-utils.ts";
import { convertLoToHtml } from "../utils/markdown-utils.ts";

export function decorateCourseTree(
  course: Course,
  courseId: string = "",
  courseUrl = "",
) {
  // define course properties
  course.courseId = courseId;
  course.courseUrl = courseUrl;
  course.route = `/course/${courseId}`;

  // retrieve all Los in course
  const allLos = flattenLos(course.los);
  allLos.push(course);

  // inject course path into all routes
  injectCourseUrl(allLos, courseId, courseUrl);

  removeUnknownLos(course.los);
  // Construct course tree
  decorateLoTree(course, course);

  // index all Los in course
  course.loIndex = new Map<string, Lo>();
  allLos.forEach((lo) => course.loIndex.set(lo.route, lo));
  const videoLos = allVideoLos(allLos);
  videoLos.forEach((lo) => course.loIndex.set(lo.video, lo));
  course.topicIndex = new Map<string, Topic>();
  //course.los.forEach((lo) => course.topicIndex.set(lo.route, lo as Topic));
  const topicLos = filterByType(allLos, "topic");
  topicLos.forEach((lo) => course.topicIndex.set(lo.route, lo as Topic));

  loadPropertyFlags(course);
  createCompanions(course);
  createWalls(course);
  // createToc(course);
  initCalendar(course);
}

export function decorateLoTree(course: Course, lo: Lo) {
  // every Lo knows its parent
  lo.parentCourse = course;
  // recover icon from frontmatter if present
  lo.icon = loadIcon(lo);
  // define breadcrump - path to all parent Los
  lo.breadCrumbs = [];
  crumbs(lo, lo.breadCrumbs);
  if (lo.breadCrumbs?.length > 2) {
    if (
      lo.breadCrumbs[1].type === "unit" ||
      lo.breadCrumbs[1].type === "side"
    ) {
      lo.breadCrumbs[1].route = lo.breadCrumbs[1].route.replace(
        "topic",
        "course",
      );
    }
  }

  // Convert contentMd to html
  convertLoToHtml(course, lo);

  if (isCompositeLo(lo)) {
    // if Lo is composite, recursively decorate all child los
    const compositeLo = lo as Composite;
    compositeLo.panels = getPanels(compositeLo.los);
    compositeLo.units = getUnits(compositeLo.los);

    compositeLo.toc = [];
    compositeLo.toc.push(
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.panels?.panelVideos,
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.panels?.panelTalks,
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.panels?.panelNotes,
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.units?.units,
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.units?.standardLos,
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...compositeLo?.units?.sides,
    );

    for (const childLo of compositeLo.los) {
      childLo.parentLo = lo;
      if (compositeLo.los) {
        decorateLoTree(course, childLo);
      }
    }
  }
}
