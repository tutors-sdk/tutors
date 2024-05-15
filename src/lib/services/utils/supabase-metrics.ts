import { db } from "$lib/services/utils/db/client";
import type { Session } from "@supabase/supabase-js";
import type { Course, LearningRecord } from "../models/lo-types";
import type { LearningInteraction } from "../types/supabase-metrics";

export async function fetchLearningRecords(course: Course): Promise<string[]> {
  const { data: metrics, error: studentsError } = await db.rpc('get_all_learner_records', {
      course_base: course.courseId
  });

  if (studentsError) {
      console.error(studentsError);
      return [];
  }

  const userIds: string[] = [...new Set(metrics.map((m: LearningInteraction) => m.studentid))] as string[];

  if (metrics && metrics.length > 0 && course.loIndex) {
      course.loIndex.forEach((lo) => {
          // Initialize a Map to store learning records for each user ID on the same route
          lo.learningRecords = new Map<string, LearningRecord>();

          metrics.forEach((learningInteraction: LearningInteraction) => {
              if (learningInteraction.loid === lo.route) {
                  // Check if a learning record already exists for the user on the same route
                  if (!lo.learningRecords?.has(learningInteraction.studentid)) {
                      // Create a new LearningRecord object for the user
                      const attachLearningRecord: LearningRecord = {
                          date: learningInteraction.date,
                          pageLoads: learningInteraction.pageloads,
                          timeActive: learningInteraction.timeactive
                      };
                      // Associate the learning record with the user ID
                      lo.learningRecords?.set(learningInteraction.studentid, attachLearningRecord);
                  }
              }
          });
      });
      course.loIndex = new Map(course.los.map((lo) => [lo.route, lo]));
  }
  return userIds || [];
};
