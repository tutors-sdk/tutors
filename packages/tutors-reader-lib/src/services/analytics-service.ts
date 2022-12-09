import { updateLo } from "../utils/course-utils";
import type { Lo } from "../types/lo-types";
import type { Course } from "../models/course";
import type { User } from "../types/auth-types";
import { currentCourse, currentUser } from "../stores/stores";

import { readValue, sanitise, updateCalendar, updateCount, updateCountValue, updateLastAccess, updateStr, updateVisits } from "tutors-reader-lib/src/utils/firebase-utils";

let course: Course;
let user: User;

currentCourse.subscribe((current) => {
  course = current;
});
currentUser.subscribe((current) => {
  user = current;
});

let mins = 0;
const func = () => {
  mins = mins + 0.5;
  if (course && !document.hidden) {
    analyticsService.updatePageCount();
  }
};
setInterval(func, 30 * 1000);

export const analyticsService = {
  courseId: "",
  courseUrl: "",
  loRoute: "",
  title: "",
  lo: <Lo>{},

  learningEvent(params: Record<string, string>, data: Record<string, string>) {
    this.courseUrl = params.courseid;
    this.courseId = params.courseid.substring(0, params.courseid.indexOf("."));
    this.loRoute = "";
    if (params.loid) {
      this.loRoute = sanitise(params.loid);
    }
    this.lo = data.lo;
    if (this.lo) {
      this.title = this.lo.title;
    } else {
      this.title = course.lo.title;
    }
    this.reportPageLoad();
  },

  setOnlineStatus(status: boolean) {
    if (!user) return false;
    const key = `${this.courseId}/users/${sanitise(user.email)}/onlineStatus`;
    if (status) {
      updateStr(key, "online");
    } else {
      updateStr(key, "offline");
    }
  },

  async getOnlineStatus(course: Course, user: User): Promise<string> {
    let status = "online";
    if (course && user) {
      this.user = user;
      this.courseId = course.url.substring(0, course.url.indexOf("."));
      const key = `${this.courseId}/users/${sanitise(user.email)}/onlineStatus`;
      status = await readValue(key);
    }
    return status;
  },

  reportPageLoad() {
    updateLastAccess(`${this.courseId}/usage/${this.loRoute}`, this.title);
    updateVisits(this.courseId);

    updateLastAccess(`all-course-access/${this.courseId}`, this.title);
    updateVisits(`all-course-access/${this.courseId}`);
    updateLo(`all-course-access/${this.courseId}`, course, this.lo);

    if (user) {
      const key = `${this.courseId}/users/${sanitise(user.email)}/${this.loRoute}`;
      updateLastAccess(key, this.lo.title);
      updateVisits(key);
    }
  },

  updatePageCount() {
    updateLastAccess(`${this.courseId}/usage/${this.loRoute}`, this.title);
    updateCount(this.courseId);
    if (user) {
      const key = `${this.courseId}/users/${sanitise(user.email)}/${this.loRoute}`;
      updateLastAccess(key, this.title);
      updateCount(key);
      updateCalendar(`${this.courseId}/users/${sanitise(user.email)}`);
    }
  },

  updateLogin(user: User) {
    const key = `${this.courseId}/users/${sanitise(user.email)}`;
    updateStr(`${key}/email`, user.email);
    updateStr(`${key}/name`, user.name);
    updateStr(`${key}/id`, user.userId);
    updateStr(`${key}/nickname`, user.nickname);
    updateStr(`${key}/picture`, user.picture);
    updateStr(`${key}/last`, new Date().toString());
    updateCountValue(`${key}/count`);
  }
};
