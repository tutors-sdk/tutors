import { page } from "$app/stores";
import { authService } from "tutors-reader-lib/src/services/auth-service";
import { get } from "svelte/store";
import { transitionKey, currentCourse, currentUser, studentsOnline, studentsOnlineList, authenticating } from "tutors-reader-lib/src/stores/stores";
import type { Course } from "tutors-reader-lib/src/models/course";
import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
import { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
import { PresenceService } from "tutors-reader-lib/src/services/presence-service";
import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
import type { User } from "tutors-reader-lib/src/types/auth-types";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
import { getKeys } from "../environment";
import { goto } from "$app/navigation";

const students: StudentMetric[] = [];
let metricsService: MetricsService;
let presenceService: PresenceService;
let lastCourse: Course;
let user: User;

export async function initServices() {
  initFirebase(getKeys().firebase);
  authService.setCredentials(getKeys().auth0);
  startPresenceEngine();

  if (getKeys().firebase.apiKey !== "XXX") {
    const pageVal = get(page);
    if (pageVal.url.hash) {
      if (pageVal.url.hash.startsWith("#/course")) {
        goto(pageVal.url.hash.slice(2));
      } else {
        authenticating.set(true);
        const token = pageVal.url.hash.substring(pageVal.url.hash.indexOf("#") + 1);
        authService.handleAuthentication(token, goto);
      }
    } else {
      if (get(currentCourse)) {
        await authService.checkAuth(get(currentCourse));
      }
    }
  }

  page.subscribe((path) => {
    if (path.url.hash.startsWith("#/course")) {
      const relPath = path.url.hash.slice(1);
      console.log(relPath);
      goto(relPath);
    }
    transitionKey.set(path.url.pathname);
    if (path.url.pathname.includes("book") || path.url.pathname.includes("pdf") || path.url.pathname.includes("video")) {
      transitionKey.set("none");
    }
  });
}

function refresh(refreshedStudents: StudentMetric[]) {
  const student = refreshedStudents.find((student) => student.nickname === user.nickname);
  if (student) {
    const index = refreshedStudents.indexOf(student);
    if (index !== -1) {
      refreshedStudents.splice(index, 1);
    }
  }
  studentsOnlineList.set([...refreshedStudents]);
  studentsOnline.set(refreshedStudents.length);
}

async function initService(course: Course) {
  metricsService.setCourse(course);
  if (presenceService) presenceService.stop();
  presenceService = new PresenceService(metricsService, students, refresh, null);
  presenceService.setCourse(course);
  await presenceService.start();
  studentsOnlineList.set([]);
  studentsOnline.set(0);
}

export function startPresenceEngine() {
  metricsService = new MetricsService();
  currentCourse.subscribe((newCourse: Course) => {
    if (newCourse && newCourse != lastCourse) {
      lastCourse = newCourse;
      if (isAuthenticated() && newCourse?.authLevel > 0) {
        initService(newCourse);
      }
    }
  });
  currentUser.subscribe((newUser: User) => {
    user = newUser;
  });
}
