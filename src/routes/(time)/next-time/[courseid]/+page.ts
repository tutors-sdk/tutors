import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import { aggregateTimeActiveByDate, decorateLearningRecords, fetchLearningInteractions } from "$lib/services/utils/supabase-metrics";
import type { LearningInteraction } from "$lib/services/types/supabase-metrics";
import { getCalendarDataForAll, getMedianTimeActivePerDate } from "$lib/services/utils/supabase-utils";

export const ssr = false;

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const data = await parent();
  if (data.session) {
    const course: Course = await courseService.readCourse(params.courseid, fetch);
    const metrics: LearningInteraction[] = await fetchLearningInteractions(course);
    const userIds: string[] = [...new Set(metrics.map((m: LearningInteraction) => m.studentid))] as string[];
    const records: LearningInteraction[] = await getCalendarDataForAll(course.courseId);
    const aggregatedData = await aggregateTimeActiveByDate(records); 
    const medianCalendarTime = await getMedianTimeActivePerDate(course.courseId);
    const calendarIds: string[] = [...new Set(Array.from(aggregatedData.entries()).map(([studentId, dateMap]) => studentId))] as string[];
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
      calendarIds: calendarIds, // Because of mismatch data in the dbs (reintroduce calendar)
      session: data.session,
      timeActiveMap: aggregatedData,
      medianTime: medianCalendarTime
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
