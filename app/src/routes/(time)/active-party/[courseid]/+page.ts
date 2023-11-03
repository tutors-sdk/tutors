import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  return {
    course: course
  };
};
