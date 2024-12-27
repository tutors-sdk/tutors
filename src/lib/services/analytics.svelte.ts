/**
 * Analytics service for tracking user interactions and learning progress.
 * Integrates with Supabase for data persistence and provides real-time analytics tracking.
 * Handles learning events, page loads, and duration tracking.
 */

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
  /** Current learning object route being tracked */
  loRoute: "",

  /**
   * Records a learning event for a specific learning object
   * Handles both direct and nested learning object routes
   * @param course - Current course context
   * @param params - Event parameters including optional learning object ID
   * @param lo - Learning object being interacted with
   * @param student - Student performing the interaction
   */
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

  /**
   * Records a page load event in Supabase
   * Creates or updates learning object interaction record
   * @param course - Current course
   * @param lo - Learning object being viewed
   * @param student - Student viewing the content
   */
  reportPageLoad(course: Course, lo: Lo, student: TutorsId) {
    try {
      storeStudentCourseLearningObjectInSupabase(course, this.loRoute, lo, student);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  /**
   * Updates analytics for time spent on learning objects
   * Tracks both individual learning object and calendar-based durations
   * @param course - Current course
   * @param lo - Learning object being tracked
   * @param student - Student to update analytics for
   */
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

  /**
   * Updates or creates student record on login
   * Ensures student data is synchronized with auth state
   * @param courseId - Course being accessed
   * @param session - Authentication session data
   */
  async updateLogin(courseId: string, session: any) {
    try {
      await addOrUpdateStudent(session.user);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  }
};
