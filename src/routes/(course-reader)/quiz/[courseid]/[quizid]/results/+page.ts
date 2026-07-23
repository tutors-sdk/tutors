import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import { getQuizById, getResponsesForQuiz } from "$lib/services/quiz";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  const quiz = await getQuizById(params.quizid);
  const responses = quiz ? await getResponsesForQuiz(quiz.id) : [];
  return { course, lo: course, quiz, responses };
};
