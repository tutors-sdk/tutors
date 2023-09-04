import type { PageLoad } from "./$types";
import { getKeys } from "$lib/environment";
import { initFirebase } from "$lib/services/utils/firebase";
import { courseService } from "$lib/services/course-ng";
import type { Course } from "$lib/services/models-ng/lo-types";
import { currentLo } from "$lib/stores";

export const load: PageLoad = async ({ params, fetch }) => {
  initFirebase(getKeys().firebase);
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  currentLo.set(course);
  return {
    course: course,
    lo: course
  };
};
