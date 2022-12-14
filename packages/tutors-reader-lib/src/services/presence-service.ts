import { Course } from "../models/course";
import { currentCourse, studentsOnline, studentsOnlineList } from "tutors-reader-lib/src/stores/stores";
import type { StudentLoEvent } from "../types/metrics-types";
import { decrypt, isAuthenticated } from "../utils/auth-utils";
import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
import { readObj, sanitise } from "../utils/firebase-utils";

let canUpdate = false;

export const presenceService = {
  db:{},
  course: Course,
  lastCourse: Course,
  students: new Map<string, StudentLoEvent>(),
  los: [],

  async visitUpdate(courseId: string) {
    const lo = await (await get(child(ref(this.db), `all-course-access/${courseId}/lo`))).val();
    if (lo) {
      const userId = decrypt(lo.tutorsTimeId);
      if (userId) {
        const user = await readObj(`${courseId}/users/${sanitise(userId)}`);
        if (user) {
          const event: StudentLoEvent = {
            studentName: user.name,
            studentImg: user.picture,
            courseTitle: lo.courseTitle,
            loTitle: lo.title,
            loImage: lo.img,
            loRoute: lo.subRoute
          };
          const studentUpdate = this.students.get(userId);
          if (!studentUpdate) {
            this.students.set(userId, event);
            this.los.push(event);
          } else {
            studentUpdate.studentName = event.studentName;
            studentUpdate.studentImg = event.studentImg;
            studentUpdate.courseTitle = event.courseTitle;
            studentUpdate.loTitle = event.loTitle;
            studentUpdate.loImage = event.loImage;
            studentUpdate.loRoute = event.loRoute;
          }
          studentsOnlineList.set([...this.los]);
          studentsOnline.set(this.los.length);
        }
      }
    }
  },

  initService(course: Course) {
    studentsOnline.set(0);
    studentsOnlineList.set([]);
    canUpdate = false;
    setTimeout(function () {
      canUpdate = true;
    }, 10000);
    const statusRef = ref(this.db, `all-course-access/${course.id}/visits`);
    onValue(statusRef, async () => {
      if (canUpdate) {
        await this.visitUpdate(course.id);
      }
    });
  },

  startPresenceEngine() {
    this.db = getDatabase();
    currentCourse.subscribe((newCourse: Course) => {
      if (newCourse && newCourse != this.lastCourse) {
        if (this.lastCourse) {
          const statusRef = ref(this.db, `all-course-access/${this.lastCourse.id}/visits`);
          off(statusRef);
        }
        this.lastCourse = newCourse;
        if (isAuthenticated() && newCourse?.authLevel > 0) {
          this.initService(newCourse);
        }
      }
    });
  }
};
