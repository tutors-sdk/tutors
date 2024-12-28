import { courseService } from "$lib/services/course.svelte";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  courseService.currentLo.value = course;

  return {
    course,
    lo: course
  };
};
