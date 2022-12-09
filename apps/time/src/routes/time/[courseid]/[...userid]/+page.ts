import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import { fetchAllUsers, fetchUserById } from "tutors-reader-lib/src/utils/metrics-utils";
import type { Course } from "tutors-reader-lib/src/models/course";
import type { UserMetric } from "tutors-reader-lib/src/types/metrics-types";
import { getKeys } from "../../../../environment";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
import { currentUser } from "tutors-reader-lib/src/stores/stores";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  const course: Course = await courseService.readCourse(params.courseid);
  const allLabs = course.walls.get("lab");
  const user: UserMetric = await fetchUserById(params.courseid, params.userid, allLabs);
  currentUser.set(user);
  const users: Map<string, UserMetric> = await fetchAllUsers(params.courseid, allLabs);
  return {
    user: user,
    course: course,
    allLabs: course.walls.get("lab"),
    calendar: course.calendar,
    ignorePin: course.lo.properties?.ignorepin?.toString(),
    users: users
  };
};
