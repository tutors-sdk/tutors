import { convertNoteMdToHtml } from "$lib/markdown/rich-markdown";
import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";

export const ssr = false;

export const load: PageLoad = async ({ url, params }) => {
  const lo = await courseService.readLo(params.courseid, url.pathname);
  convertNoteMdToHtml(lo);
  return {
    lo: lo
  };
};
