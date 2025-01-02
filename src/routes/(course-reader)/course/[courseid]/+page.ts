import { currentCourse } from "$lib/runes";
import { courseService } from "$lib/services/course.svelte";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;

  return {
    course,
    lo: course
  };
};
