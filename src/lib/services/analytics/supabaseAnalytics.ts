import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import type { Analytics } from "../types/analytics";
import { onlineStatus } from "$lib/stores";
import { get } from "svelte/store";
import { presenceService } from "../presence";
import {
  updateStudentsStatus,
  storeStudentCourseLearningObjectInSupabase,
  updateLearningRecordsDuration,
  updateDuration,
  updateCalendarDuration,
  addOrUpdateStudent,
  updateLastAccess,
  readValue,
  formatDate
} from "../utils/supabase-utils";

export const supabaseAnalytics: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {
    try {
      if (params.loid) {
        const targetRouteParts = lo.route.split("/");
        const trimmedTargetRoute = targetRouteParts.slice(0, 3).join("/");
        this.loRoute = trimmedTargetRoute + "/" + params.loid;
      } else {
        this.loRoute = lo.route;
      }
      this.reportPageLoad(course, session, lo);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  setOnlineStatus(course: Course, status: boolean, session: Session) {
    try {
      const onlineStatus = status ? "online" : "offline";
      updateStudentsStatus(session.user.id, onlineStatus);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  async getOnlineStatus(course: Course, session: Session): Promise<string> {
    if (!course || !session) {
      return "online";
    }
    const status = await readValue(session.user.id);
    return status || "online";
  },

  reportPageLoad(course: Course, session: Session, lo: Lo) {
    try {
      storeStudentCourseLearningObjectInSupabase(course, this.loRoute, lo, session?.user);
      presenceService.sendLoEvent(course, lo, get(onlineStatus), session);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  updatePageCount(course: Course, session: Session, lo: Lo) {
    try {
      if (session?.user) {
        if (lo.route) updateLearningRecordsDuration(course.courseId, session.user.user_metadata.user_name, this.loRoute);
        updateCalendarDuration(formatDate(new Date()), session.user.user_metadata.user_name, course.courseId);
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
