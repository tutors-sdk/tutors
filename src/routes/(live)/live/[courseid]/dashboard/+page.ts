import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";

export const load = async ({ params, fetch, url }) => {
  const isMock = url.searchParams.get("mock") === "true";
  try {
    const course = await courseService.readCourse(params.courseid, fetch);
    currentCourse.value = course;
    return { courseid: params.courseid, course };
  } catch (e) {
    if (isMock) {
      const stub = { courseId: params.courseid, title: params.courseid } as any;
      currentCourse.value = stub;
      return { courseid: params.courseid, course: stub };
    }
    throw e;
  }
};
