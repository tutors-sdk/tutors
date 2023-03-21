import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";



export const load: PageLoad = async ({ url, params }) => {
  const lo = await courseService.readLo(params.courseid, url.pathname);
  return {
    lo: lo
  };
};
