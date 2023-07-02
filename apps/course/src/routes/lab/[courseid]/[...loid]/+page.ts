import { initMarkdownParser } from "../../../tutors-startup";
import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";

export const ssr = false;

export const load: PageLoad = async ({ url, params }) => {
  // initMarkdownParser();
  const lab = await courseService.readLab(params.courseid, url.pathname);
  const lastSegment = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
  if (lastSegment.startsWith("book")) {
    lab.setFirstPageActive();
  } else {
    lab.setActivePage(lastSegment);
  }
  return {
    lab: lab,
    lo: lab.lo
  };
};
