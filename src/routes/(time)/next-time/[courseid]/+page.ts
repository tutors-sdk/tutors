import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import { aggregateTimeActiveByDate, decorateLearningRecords, fetchLearningUserInteractions } from "$lib/services/utils/supabase-metrics";
import type { LearningInteraction } from "$lib/services/types/supabase-metrics";
import { getCalendarDataForAll, getGithubAvatarUrl, getMedianTimeActivePerDate, getUserNames } from "$lib/services/utils/supabase-utils";

export const ssr = false;

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const data = await parent();
  if (data.session) {
    const course: Course = await courseService.readCourse(params.courseid, fetch);
    const userMetrics: LearningInteraction[] = await fetchLearningUserInteractions(course);
    const userIds: string[] = [...new Set(userMetrics.map((m: LearningInteraction) => m.studentid))] as string[];
    const userNamesAvatars: Map<string, [string | undefined, string | undefined]> = new Map(userMetrics.map((m: LearningInteraction) => [m.studentid, [m.fullName, m.avatarUrl]]));
    // const userNamesUseridsMap: Map<string, string> = await getUserNames(userIds);
    // const userAvatarsUseridsMap: Map<string, string> = await getGithubAvatarUrl(userIds);
    const records: LearningInteraction[] = await getCalendarDataForAll(course.courseId);
    const aggregatedData = await aggregateTimeActiveByDate(records);
    const medianCalendarTime = await getMedianTimeActivePerDate(course.courseId);
    const calendarIds: string[] = [...new Set(Array.from(aggregatedData.entries()).map(([studentId, dateMap]) => studentId))] as string[];
    await decorateLearningRecords(course, userMetrics);

    return {
      course: course,
      userIds: userIds,
      userNamesAvatars: userNamesAvatars,
      // userNamesUseridsMap: userNamesUseridsMap,
      // userAvatarsUseridsMap: userAvatarsUseridsMap,
      calendarIds: calendarIds, // Because of mismatch data in the dbs (reintroduce calendar)
      session: data.session,
      timeActiveMap: aggregatedData,
      medianTime: medianCalendarTime
    };
  }
};
