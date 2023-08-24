import { updateLo } from "$lib/services/utils/course";
import type { Lo } from "$lib/services/types/lo";
import type { Course } from "$lib/services/models/course";
import type { TokenResponse } from "$lib/services/types/auth";
import { currentCourse, currentLo, currentUser } from "$lib/stores";

import {
  readValue,
  sanitise,
  updateCalendar,
  updateCount,
  updateCountValue,
  updateLastAccess,
  updateStr,
  updateVisits
} from "$lib/services/utils/firebase";

let course: Course;
let user: TokenResponse;
let lo: Lo;

currentCourse.subscribe((current) => {
  course = current;
});
currentUser.subscribe((current) => {
  user = current;
});
currentLo.subscribe((current) => {
  lo = current;
});

export const analyticsService = {
  loRoute: "",

  learningEvent(params: Record<string, string>, session: TokenResponse) {
    if (params.loid) {
      this.loRoute = sanitise(params.loid);
    }
    this.reportPageLoad(session);
  },

  setOnlineStatus(status: boolean, session: TokenResponse) {
    const onlineStatus = status ? "online" : "offline";
    const key = `${course.id}/users/${sanitise(session.user.email)}/onlineStatus`;
    updateStr(key, onlineStatus);
  },

  async getOnlineStatus(course: Course, session: TokenResponse): Promise<string> {
    if (!course || !user) {
      return "online";
    }
    const courseId = course.url.substring(0, course.url.indexOf("."));
    const key = `${courseId}/users/${sanitise(session.user.email)}/onlineStatus`;
    const status = await readValue(key);
    return status || "online";
  },

  reportPageLoad(session: TokenResponse) {
    updateLastAccess(`${course.id}/usage/${this.loRoute}`, course.lo.title);
    updateVisits(course.url.substring(0, course.url.indexOf(".")));

    if (!session || (session && session.onlineStatus === "online")) {
      updateLastAccess(`all-course-access/${course.id}`, course.lo.title);
      updateVisits(`all-course-access/${course.id}`);
      updateLo(`all-course-access/${course.id}`, course, lo);
    }

    if (session) {
      const key = `${course.url.substring(0, course.url.indexOf("."))}/users/${sanitise(
        session.user.email
      )}/${this.loRoute}`;
      updateLastAccess(key, lo.title);
      updateVisits(key);
    }
  },

  updatePageCount(session: TokenResponse) {
    updateLastAccess(`${course.id}/usage/${this.loRoute}`, course.lo.title);
    updateCount(course.id);
    if (user) {
      updateCount(`all-course-access/${course.id}`);
      if (user.onlineStatus === "online") {
        updateLo(`all-course-access/${course.id}`, course, lo);
      }
      const key = `${course.id}/users/${sanitise(session.user.email)}/${this.loRoute}`;
      updateLastAccess(key, lo.title);
      updateCount(key);
      updateCalendar(`${course.id}/users/${sanitise(session.user.email)}`);
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
