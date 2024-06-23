import { db } from "$lib/services/utils/db/client";
import type { Session } from "@supabase/supabase-js";
import type { Course, LearningRecord } from "../models/lo-types";
import type { LearningInteraction } from "../types/supabase-metrics";
import { formatDate, getCalendarDataForAll } from "./supabase-utils";

export async function fetchLearningInteractions(course: Course): Promise<LearningInteraction[]> {
  const { data: metrics, error: studentsError } = await db.rpc("get_all_learner_records", {
    course_base: course.courseId
  });

  if (studentsError) {
    console.error(studentsError);
    return [];
  }
  return metrics;
}

export async function aggregateTimeActiveByDate(records: LearningInteraction[]): Promise<Map<string, Map<string, number>>> {
  const timeActiveMap = new Map<string, Map<string, number>>();

  // Iterate over the records
  records?.forEach((record) => {
    const formattedDate = formatDate(record.id);
    const studentId = record.studentid;
    const timeActive = record.timeactive;

    // If the studentId is not in the map, add it with a new Map
    if (!timeActiveMap.has(studentId)) {
      timeActiveMap.set(studentId, new Map<string, number>());
    }

    // Get the dateMap for the studentId
    const dateMap = timeActiveMap.get(studentId)!;
    dateMap.set(formattedDate, timeActive);
  });

  return timeActiveMap;
}

export async function decorateLearningRecords(course: Course, metrics: LearningInteraction[]): Promise<void> {
  if (metrics && metrics.length > 0 && course.loIndex) {
    course.loIndex.forEach((lo) => {
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
}
