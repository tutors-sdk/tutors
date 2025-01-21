import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import { flattenLos } from "$lib/services/course/utils/lo-utils";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  const allLos = flattenLos(course.los);
  const videos = allLos.filter((lo) => lo.type === "panelvideo");
  return {
    course,
    lo: course,
    videos
  };
};
