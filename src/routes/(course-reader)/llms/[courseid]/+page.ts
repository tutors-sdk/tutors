import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import { generateLlms } from "./llms";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  const page = generateLlms(course);
  return {
    course,
    page
  };
};
