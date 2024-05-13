import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import { fetchLearningRecords } from "$lib/services/utils/supabase-metrics";
import { user } from "$lib/ui/time/firebase/CalendarTime.svelte";

export const ssr = false;

const isStringArray = (test: any[]): boolean => {
  return Array.isArray(test) && !test.some((value) => typeof value !== "string");
};

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const data = await parent();
  if (data.session) {
    const course: Course = await courseService.readCourse(params.courseid, fetch);
    const userIds = await fetchLearningRecords(course, data.session);
    // if (course.hasEnrollment && course.enrollment) {
    //   for (let i = 0; i < course.enrollment.length; i++) {
    //     const enrolledUser = users.get(course.enrollment[i]);
    //     if (enrolledUser) {
    //       if (!enrolledUser.student.name) {
    //         const response = await fetch(`https://api.github.com/users/${enrolledUser.nickname}`);
    //         const latestProfile = await response.json();
    //         if (latestProfile.name) {
    //           enrolledUser.student.name = latestProfile.name;
    //         } else {
    //           enrolledUser.student.name = latestProfile.login;
    //         }
    //       }
    //       enrolledUsers.set(course.enrollment[i], enrolledUser);
    //     }
    //   }
    //}
    return {
      course: course,
      usersIds: usersIds,
      // allLabs: course.wallMap?.get("lab"),
      // allTopics: course.los,
      // allActivities: allLos,
      // calendar: course.courseCalendar,
      // ignorePin: course.ignorePin,
      // users: users,
      // enrolledUsers
    };
  }

};
