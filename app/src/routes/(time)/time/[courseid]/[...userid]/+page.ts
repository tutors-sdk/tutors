import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { fetchAllUsers, fetchUserById } from "$lib/services/utils/metrics";
import type { Course } from "$lib/services/models/lo-types";
import type { UserMetric } from "$lib/services/types/metrics";
import { getKeys } from "$lib/environment";
import { initFirebase } from "$lib/services/utils/firebase";

export const ssr = false;

const isStringArray = (test: any[]): boolean => {
  return Array.isArray(test) && !test.some((value) => typeof value !== "string");
};

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const data = await parent();

  if (data.session) {
    initFirebase(getKeys().firebase);
    const course: Course = await courseService.readCourse(params.courseid, fetch);
    const allLabs = course.wallMap?.get("lab");
    const user: UserMetric = await fetchUserById(params.courseid, data.session, allLabs);
    const users: Map<string, UserMetric> = await fetchAllUsers(params.courseid, allLabs);
    const enrolledUsers: Map<string, UserMetric> = new Map<string, UserMetric>();
    if (course.hasEnrollment) {
      const students = course.getEnrolledStudentIds();
      if (isStringArray(students)) {
        for (const githubId of users.keys()) {
          if (students.includes(githubId)) {
            const enrolledUser = users.get(githubId);
            if (enrolledUser) {
              enrolledUsers.set(githubId, enrolledUser);
            }
          }
        }
      }
    }
    return {
      user: user,
      course: course,
      allLabs: course.wallMap?.get("lab"),
      calendar: course.calendar,
      ignorePin: course.lo.properties?.ignorepin?.toString(),
      users: users,
      enrolledUsers
    };
  }
};
