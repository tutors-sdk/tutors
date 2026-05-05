import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import type { Course } from "@tutors/tutors-model-lib";

export const load = async ({ params, parent, fetch }) => {
  // presenceService.startCoursePresenceListener(params.courseid);
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  return {
    courseid: params.courseid,
    course: course
  };
};
