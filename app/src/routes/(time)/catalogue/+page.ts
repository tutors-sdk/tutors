import { getKeys } from "$lib/environment";
import { isValidCourseName } from "$lib/services/utils/all-course-access";
import { initFirebase, readAllCourseIds } from "$lib/services/utils/firebase";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  const courses = await readAllCourseIds(getKeys().firebase);
  const validCourses = courses.filter((courseId) => isValidCourseName(courseId));

  return {
    allCourses: validCourses
  };
};
