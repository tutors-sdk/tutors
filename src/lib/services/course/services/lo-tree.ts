import { courseProtocol } from "$lib/runes.svelte";
import { courseBaseDomain } from "$lib/services/course/config";
import {
  allVideoLos,
  convertLoToHtml,
  createCompanions,
  createWalls,
  crumbs,
  filterByType,
  fixRoutePaths,
  flattenLos,
  getPanels,
  getUnits,
  initCalendar,
  isCompositeLo,
  loadIcon,
  loadPropertyFlags,
  removeUnknownLos,
  type Archive,
  type Composite,
  type Course,
  type Lab,
  type Lo,
  type Talk,
  type Topic,
  type Tutorial
} from "@tutors/tutors-model-lib";

export function decorateCourseTree(course: Course, courseId: string = "", courseUrl = "") {
  // define course properties
  course.courseId = courseId;
  course.courseUrl = courseUrl;
  course.route = `/course/${courseId}`;

  // retrieve all Los in course
  let allLos = flattenLos(course.los);
  allLos.push(course);
  // inject course path into all routes
  injectCourseUrl(allLos, courseId, courseUrl);
  // remove all los with type = "web"
  allLos = allLos.filter((lo) => lo.type !== "web");

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

function decorateLoTree(course: Course, lo: Lo) {
  // every Lo knows its parent
  lo.parentCourse = course;
  // recover icon from frontmatter if present
  lo.icon = loadIcon(lo);
  // define breadcrump - path to all parent Los
  lo.breadCrumbs = [];
  crumbs(lo, lo.breadCrumbs);
  if (lo.breadCrumbs?.length > 2) {
    if (lo.breadCrumbs[1].type === "unit" || lo.breadCrumbs[1].type === "side") {
      lo.breadCrumbs[1].route = lo.breadCrumbs[1].route.replace("topic", "course");
    }
  }

  // Convert contentMd to html
  if (lo.type !== "lab" && lo.type !== "note" && lo.type !== "notebook") {
    // Convert labs, notes & notebooks on demand as can be time consuming to convert all at once
    convertLoToHtml(course, lo);
  }

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
      ...compositeLo?.units?.sides
    );

    for (const childLo of compositeLo.los) {
      childLo.parentLo = lo;
      if (compositeLo.los) {
        decorateLoTree(course, childLo);
      }
    }
  }
}

function injectCourseUrl(los: Lo[], id: string, url: string) {
  los.forEach((lo) => {
    if (lo.type === "archive") {
      const archive: Archive = lo as Archive;
      archive.route = `https://${lo.route?.replace("/archive/{{COURSEURL}}", url)}/${archive.archiveFile}`;
    } else {
      lo.route = lo.route?.replace("{{COURSEURL}}", id);
    }

    lo.img = lo.img?.replace("{{COURSEURL}}", url);
    lo.video = lo.video?.replace("{{COURSEURL}}", id);
    if (lo.type == "talk" || lo.type == "paneltalk") {
      const talk = lo as Talk;
      talk.pdf = talk.pdf?.replace("{{COURSEURL}}", url);
    }
    if (lo.type === "tutorial") {
      const tutorial = lo as Tutorial;
      if (tutorial.pdf) {
        tutorial.pdf = tutorial.pdf?.replace("{{COURSEURL}}", url);
      }
    }
    if (lo.type == "lab") {
      const lab = lo as Lab;
      lab.pdf = lab.pdf?.replace("{{COURSEURL}}", url);
    }

    localizePath(lo);
    fixRoutePaths(lo);
  });
}

function localizePath(lo: Lo) {
  if (courseProtocol.value === "http://") {
    lo.route = lo.route?.replace("https://", "http://");
    lo.video = lo.video?.replace("https://", "http://");
    lo.img = lo.img?.replace("https://", "http://");
    if (lo.pdf) {
      lo.pdf = lo?.pdf?.replace("https://", "http://");
    }
  }
}

/**
 * Determines the course URL and normalized course ID from various input formats.
 * Handles full URLs, localhost/IP addresses, and plain course IDs.
 * @param input - Course identifier (URL, domain, or ID)
 * @param baseDomain - Domain suffix for plain course IDs (default: from PUBLIC_COURSE_BASE_DOMAIN env var)
 * @returns Object with normalized courseId and courseUrl
 */
export function determineCourseUrl(input: string, baseDomain: string = courseBaseDomain): { courseId: string; courseUrl: string } {
  const urlPattern = /^(https?:\/\/)?([A-Za-z0-9.-]+\.[A-Za-z]{2,})(:[0-9]+)?(\/[A-Za-z0-9_.-]+)*(\/[A-Za-z0-9_.-]+\?[A-Za-z0-9_=-]+)?(#.*)?$/;
  const isValidURL = urlPattern.test(input);

  if (isValidURL) {
    const courseUrl = input;
    const courseId = input.includes(baseDomain) ? input.replace(baseDomain, "") : input;
    return { courseId, courseUrl };
  }

  const isLocalhost = input.startsWith("192") || input.startsWith("localhost");
  if (isLocalhost) {
    courseProtocol.value = "http://";
    return { courseId: input, courseUrl: input };
  }

  return { courseId: input, courseUrl: `${input}${baseDomain}` };
}
