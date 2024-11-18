import type { Course, Lo } from "$lib/services/models/lo-types";
import type { AnalyticsService, TutorsId } from "./types.svelte";

import {
  storeStudentCourseLearningObjectInSupabase,
  updateLearningRecordsDuration,
  updateCalendarDuration,
  addOrUpdateStudent,
  formatDate
} from "./profiles/supabase-client";

export const analyticsService: AnalyticsService = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, lo: Lo, student: TutorsId) {
    try {
      if (params.loid) {
        const targetRouteParts = lo.route.split("/");
        const trimmedTargetRoute = targetRouteParts.slice(0, 3).join("/");
        this.loRoute = trimmedTargetRoute + "/" + params.loid;
      } else {
        this.loRoute = lo.route;
      }
      this.reportPageLoad(course, lo, student);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  reportPageLoad(course: Course, lo: Lo, student: TutorsId) {
    try {
      storeStudentCourseLearningObjectInSupabase(course, this.loRoute, lo, student);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  updatePageCount(course: Course, lo: Lo, student: TutorsId) {
    try {
      if (student) {
        if (lo.route) updateLearningRecordsDuration(course.courseId, student.login, this.loRoute);
        updateCalendarDuration(formatDate(new Date()), student.login, course.courseId);
      }
    } catch (error: any) {
      console.error(`TutorStore Error: ${error.message}`);
    }
  },

  async updateLogin(courseId: string, session: any) {
    try {
      await addOrUpdateStudent(session.user);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  }
};
