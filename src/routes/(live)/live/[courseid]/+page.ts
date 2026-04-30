import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";

/** TutorsTime uses browser Supabase (`hooks.client`); keep loads on the client. */
export const ssr = false;

export const load = async ({ params }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  return {
    courseid: params.courseid,
    course: course,
  };
};
