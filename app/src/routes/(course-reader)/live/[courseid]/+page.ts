import type { PageLoad } from "./$types";
import { getKeys } from "$lib/environment";
import { initFirebase } from "$lib/utils/firebase";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/models/course";
import { currentLo } from "$lib/stores";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  const course: Course = await courseService.readCourse(params.courseid);
  currentLo.set(course.lo);
  return {
    course: course,
    lo: course.lo
  };
};
