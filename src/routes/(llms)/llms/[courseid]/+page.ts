import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;

  return {
    course,
    lo: course
  };
};
