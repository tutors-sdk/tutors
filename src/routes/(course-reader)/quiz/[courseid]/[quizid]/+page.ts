import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import { getQuizById } from "$lib/services/quiz";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  const quiz = await getQuizById(params.quizid);
  return { course, lo: course, quiz };
};
