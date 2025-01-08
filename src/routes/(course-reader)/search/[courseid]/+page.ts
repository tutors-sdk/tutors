import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course/services/course.svelte";
import type { Course } from "$lib/services/course/models/lo-types";
import { currentLo } from "$lib/runes";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  currentLo.value = course;
  return {
    course: course
  };
};
