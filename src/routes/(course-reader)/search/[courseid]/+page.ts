import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course.svelte";
import type { Course } from "$lib/services/models/lo-types";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  courseService.currentLo.value = course;
  return {
    course: course
  };
};
