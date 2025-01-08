import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course/services/course.svelte";
import type { Course } from "$lib/services/base/lo-types";
import { currentLo } from "$lib/runes.svelte";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  currentLo.value = course;
  return {
    course: course
  };
};
