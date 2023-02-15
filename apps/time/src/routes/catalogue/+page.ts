import type { PageLoad } from "./$types";

import { getKeys } from "../../environment";
import { initFirebase, readAllCourseIds } from "tutors-reader-lib/src/utils/firebase-utils";
import { isValidCourseName } from "tutors-reader-lib/src/utils/course-utils";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  const courses = await readAllCourseIds(getKeys().firebase);
  const validCourses = courses.filter((courseId) => isValidCourseName(courseId));

  return {
    allCourses: validCourses
  };
};
