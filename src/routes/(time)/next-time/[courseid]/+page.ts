import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import { aggregateTimeActiveByDate, decorateLearningRecords, fetchLearningInteractions } from "$lib/services/utils/supabase-metrics";
import type { LearningInteraction } from "$lib/services/types/supabase-metrics";

export const ssr = false;

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const data = await parent();
  if (data.session) {
    const course: Course = await courseService.readCourse(params.courseid, fetch);
    const metrics: LearningInteraction[] = await fetchLearningInteractions(course);
    const userIds: string[] = [...new Set(metrics.map((m: LearningInteraction) => m.studentid))] as string[];
    const timeActiveMap = await aggregateTimeActiveByDate(metrics);
    await decorateLearningRecords(course, metrics);
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
      userIds: userIds,
      session: data.session,
      timeActiveMap: timeActiveMap
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
