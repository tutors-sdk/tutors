import { courseService } from "$lib/services/course.svelte";
import { currentLo } from "$lib/runes";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentLo.value = course;

  return {
    course,
    lo: course
  };
};
