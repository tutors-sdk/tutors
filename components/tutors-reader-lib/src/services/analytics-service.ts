import { isValidCourseName, updateLo } from "tutors-reader-lib/src/utils/course-utils";
import type { Lo } from "tutors-reader-lib/src/types/lo-types";
import type { Course } from "tutors-reader-lib/src/models/course";
import type { User } from "tutors-reader-lib/src/types/auth-types";
import { checkAuth } from "./auth-service";
import { getKeys } from "tutors-course-reader/src/environment";
import { currentCourse } from "tutors-reader-lib/src/stores/stores";

import { getNode, initFirebase, updateCalendar, updateCount, updateCountValue, updateLastAccess, updateStr, updateVisits } from "tutors-reader-lib/src/utils/firebase-utils";

let currentAnalytics: AnalyticsService;
let course: Course;
let currentRoute = "";
let currentLo: Lo;

currentCourse.subscribe((current) => {
  if (current) course = current;
});

let mins = 0;
const func = () => {
  mins = mins + 0.5;
  if (course && !document.hidden && getKeys().firebase.apiKey !== "XXX") {
    currentAnalytics?.reportPageCount(currentRoute, course, currentLo);
  }
};
setInterval(func, 30 * 1000);

export class AnalyticsService {
  courseBaseName = "";
  userEmail = "";
  userEmailSanitised = "";
  userId = "";
  firebaseIdRoot = "";
  firebaseEmailRoot = "";
  url = "";

  constructor() {
    initFirebase(getKeys().firebase);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentAnalytics = this;
  }

  setOnlineStatus(course: Course, status: boolean) {
    checkAuth(course, "course", this);
    this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
    if (status) {
      updateStr(`${this.firebaseEmailRoot}/onlineStatus`, "online");
    } else {
      updateStr(`${this.firebaseEmailRoot}/onlineStatus`, "offline");
    }
  }

  pageLoad(route: string, lo: Lo) {
    if (getKeys().firebase.apiKey === "XXX") return;

    currentRoute = route;
    currentLo = lo;
    if (course.authLevel > 0 && lo.type != "course") {
      checkAuth(course, "course", this);
    }
    this.reportPageLoad(route, course, lo);
  }

  initRoot(url: string) {
    this.url = url;
    this.courseBaseName = url.substr(0, url.indexOf("."));
    this.firebaseIdRoot = `${this.courseBaseName}/usage`;
  }

  reportLogin(user: User, url: string) {
    if (!isValidCourseName(this.courseBaseName)) return;

    if (this.userEmail !== user.email || this.url !== url) {
      this.initRoot(url);
      this.userEmail = user.email;
      this.userId = user.userId;
      // eslint-disable-next-line no-useless-escape
      this.userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      this.updateLogin(user);
    }
  }

  reportPageLoad(path: string, course: Course, lo: Lo) {
    if (!isValidCourseName(this.courseBaseName)) return;
    if (!lo) return;

    this.initRoot(course.url);
    const node = getNode(lo.type, course.url, path);
    updateLastAccess(this.firebaseIdRoot, node, lo.title);
    updateVisits(this.firebaseIdRoot, node);

    updateLastAccess(`all-course-access/${this.courseBaseName}`, "", lo.title);
    updateVisits(`all-course-access/${this.courseBaseName}`, "");
    updateLo(`all-course-access/${this.courseBaseName}`, course, lo);

    if (this.userEmail) {
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      updateLastAccess(this.firebaseEmailRoot, node, lo.title);
      updateVisits(this.firebaseEmailRoot, node);
    }
  }

  reportPageCount(path: string, course: Course, lo: Lo) {
    if (!isValidCourseName(this.courseBaseName)) return;
    if (!lo) return;

    this.initRoot(course.url);
    const node = getNode(lo.type, course.url, path);
    updateLastAccess(this.firebaseIdRoot, node, lo.title);
    updateCount(this.firebaseIdRoot, node);
    if (this.userEmail) {
      updateLastAccess(this.firebaseEmailRoot, node, lo.title);
      updateCount(this.firebaseEmailRoot, node);
      updateCalendar(this.firebaseEmailRoot);
    }
  }

  updateLogin(user: User) {
    updateStr(`${this.firebaseEmailRoot}/email`, user.email);
    updateStr(`${this.firebaseEmailRoot}/name`, user.name);
    updateStr(`${this.firebaseEmailRoot}/id`, user.userId);
    updateStr(`${this.firebaseEmailRoot}/nickname`, user.nickname);
    updateStr(`${this.firebaseEmailRoot}/picture`, user.picture);
    updateStr(`${this.firebaseEmailRoot}/last`, new Date().toString());
    updateCountValue(`${this.firebaseEmailRoot}/count`);
  }
}
