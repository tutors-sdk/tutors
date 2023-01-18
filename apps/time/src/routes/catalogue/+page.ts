import type { PageLoad } from "./$types";

import { getKeys } from "../../environment";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";

import { fetchAllCourseAccess, deleteObj } from "tutors-reader-lib/src/utils/firebase-utils";
import { isValidCourseName } from "tutors-reader-lib/src/utils/course-utils";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  let allCourseAccess = await fetchAllCourseAccess();
  if (allCourseAccess) {
    const invalidCourses = allCourseAccess.filter((usage) => !isValidCourseName(usage.courseId));
    invalidCourses.forEach((course) => {
      deleteObj("all-course-access", course.courseId);
    });
    allCourseAccess = allCourseAccess.filter((usage) => isValidCourseName(usage.courseId));
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 50);
  }
  return {
    allCourses: allCourseAccess
  };
};
