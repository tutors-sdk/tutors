import { get } from "svelte/store";
import { updateLo } from "$lib/services/utils/all-course-access";
import type { Course, Lo } from "$lib/services/models/lo-types";
import { onlineStatus } from "$lib/stores";

import { readValue, sanitise, updateCalendar, updateCount, updateCountValue, updateLastAccess, updateStr, updateVisits } from "$lib/services/utils/firebase-utils";
import { presenceService } from "./presence";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Session } from "@supabase/auth-js/src/lib/types";
import type { Analytics } from "./types/analytics";

export const firebaseAnalytics: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {
    if (params.loid) {
      this.loRoute = sanitise(params.loid);
    }
    this.reportPageLoad(course, session, lo);
  },

  setOnlineStatus(course: Course, status: boolean, session: Session) {
    const onlineStatus = status ? "online" : "offline";
    const key = `${course.courseId}/users/${sanitise(session.user.email!)}/onlineStatus`;
    updateStr(key, onlineStatus);
  },

  async getOnlineStatus(course: Course, session: Session): Promise<string> {
    if (!course || !session) {
      return "online";
    }
    const courseId = course.courseUrl.substring(0, course.courseUrl.indexOf("."));
    const key = `${courseId}/users/${sanitise(session.user.email!)}/onlineStatus`;
    const status = await readValue(key);
    return status || "online";
  },

  reportPageLoad(course: Course, session: Session, lo: Lo) {
    if (!lo || PUBLIC_SUPABASE_URL === "XXX") return;
    updateLastAccess(`${course.courseId}/usage/${this.loRoute}`, course.title);
    updateVisits(course.courseUrl.substring(0, course.courseUrl.indexOf(".")));

    updateLastAccess(`all-course-access/${course.courseId}`, course.title);
    updateVisits(`all-course-access/${course.courseId}`);
    updateLo(`all-course-access/${course.courseId}`, course, lo, get(onlineStatus), session);

    presenceService.sendLoEvent(course, lo, get(onlineStatus), session);

    if (session) {
      const key = `${course.courseUrl.substring(0, course.courseUrl.indexOf("."))}/users/${sanitise(session.user.email!)}/${this.loRoute}`;
      updateLastAccess(key, lo.title);
      updateVisits(key);
    }
  },

  updatePageCount(course: Course, session: Session, lo: Lo) {
    if (!lo) return;
    updateLastAccess(`${course.courseId}/usage/${this.loRoute}`, course.title);
    updateCount(course.courseId);
    if (session?.user) {
      updateCount(`all-course-access/${course.courseId}`);
      updateLo(`all-course-access/${course.courseId}`, course, lo, get(onlineStatus), session);
      const key = `${course.courseId}/users/${sanitise(session.user.email!)}/${this.loRoute}`;
      updateLastAccess(key, lo.title);
      updateCount(key);
      updateCalendar(`${course.courseId}/users/${sanitise(session.user.email!)}`);
    }
  },

  updateLogin(courseId: string, session: any) {
    const key = `${courseId}/users/${sanitise(session.user.email)}`;
    updateStr(`${key}/email`, session.user.email);
    updateStr(`${key}/name`, session.user.user_metadata.full_name);
    updateStr(`${key}/id`, session.user.id);
    updateStr(`${key}/nickname`, session.user.user_metadata.preferred_username);
    updateStr(`${key}/picture`, session.user.user_metadata.avatar_url);
    updateStr(`${key}/last`, new Date().toString());
    updateCountValue(`${key}/count`);
  }
};
