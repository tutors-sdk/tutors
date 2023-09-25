import { getKeys } from "$lib/environment";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import { initFirebase } from "$lib/services/utils/firebase";
import type { PageLoad } from "./$types";
import { presenceService } from "./presence-engine";

export const load: PageLoad = async ({ params, fetch }) => {
  initFirebase(getKeys().firebase);
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  presenceService.initService(course);
  return {
    course: course,
    lo: course
  };
};
