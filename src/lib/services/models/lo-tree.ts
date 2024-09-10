import { isCompositeLo, type Course, type Lo, type Composite, type LoType, type Topic } from "./lo-types";
import { convertLoToHtml } from "./markdown-utils";
import { allVideoLos, crumbs, flattenLos, loadIcon, getPanels, getUnits, injectCourseUrl, removeUnknownLos, filterByType } from "./lo-utils";
import { createCompanions, createToc, createWalls, initCalendar, loadPropertyFlags } from "./course-utils";

export function decorateCourseTree(course: Course, courseId: string = "", courseUrl = "") {
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
  createToc(course);
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
  // Convert summary and contentMd to html
  convertLoToHtml(course, lo);

  if (isCompositeLo(lo)) {
    // if Lo is composite, recursively decorate all child los
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
