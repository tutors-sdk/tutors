import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import type { Analytics } from "../types/analytics";
import { firebaseAnalytics } from "./firebaseAnalytics";
import { supabaseAnalytics } from "./supabaseAnalytics";

export const analyticsService: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {
    supabaseAnalytics.learningEvent(course, params, session, lo);
  },

  setOnlineStatus(course: Course, status: boolean, session: Session) {
    supabaseAnalytics.setOnlineStatus(course, status, session);
  },

  async getOnlineStatus(course: Course, session: Session): Promise<string> {
    return supabaseAnalytics.getOnlineStatus(course, session);
  },

  reportPageLoad(course: Course, session: Session, lo: Lo) {
    supabaseAnalytics.reportPageLoad(course, session, lo);
  },

  updatePageCount(course: Course, session: Session, lo: Lo) {
    supabaseAnalytics.updatePageCount(course, session, lo);
  },

  updateLogin(courseId: string, session: any) {
    supabaseAnalytics.updateLogin(courseId, session);
  }
};
