import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/auth-js/src/lib/types";
import type { Analytics } from "./types/analytics";
import { firebaseAnalytics } from "./firebaseAnalytics";

export const analyticsService: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {
    firebaseAnalytics.learningEvent(course, params, session, lo);
  },

  setOnlineStatus(course: Course, status: boolean, session: Session) {
    firebaseAnalytics.setOnlineStatus(course, status, session);
  },

  async getOnlineStatus(course: Course, session: Session): Promise<string> {
    return firebaseAnalytics.getOnlineStatus(course, session);
  },

  reportPageLoad(course: Course, session: Session, lo: Lo) {
    firebaseAnalytics.reportPageLoad(course, session, lo);
  },

  updatePageCount(course: Course, session: Session, lo: Lo) {
    firebaseAnalytics.updatePageCount(course, session, lo);
  },

  updateLogin(courseId: string, session: any) {
    firebaseAnalytics.updateLogin(courseId, session);
  }
};
