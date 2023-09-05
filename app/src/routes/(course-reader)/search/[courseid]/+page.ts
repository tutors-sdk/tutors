import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course-ng";
import type { Course } from "$lib/services/models-ng/lo-types";
import { currentLo } from "$lib/stores";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  currentLo.set(course);
  return {
    course: course,
  };
};
