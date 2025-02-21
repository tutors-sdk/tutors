import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/base";
import { currentLo } from "$lib/runes.svelte";
export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course: Course = await courseService.readCourse(params.courseid, fetch);
  currentLo.value = course;

  return {
    course: course
  };
};

  
