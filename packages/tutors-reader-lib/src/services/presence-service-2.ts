import { Course } from "../models/course";
import { currentCourse, studentsOnline2, studentsOnlineList2 } from "tutors-reader-lib/src/stores/stores";
import type { StudentLoEvent } from "../types/metrics-types";
import { decrypt, isAuthenticated } from "../utils/auth-utils";
import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
import { readObj, sanitise } from "../utils/firebase-utils";

export const presenceService2 = {
  course: Course,
  lastCourse: Course,
  students: new Map<string, StudentLoEvent>(),
  los: [],
  firstUpdate: true,

  async visitUpdate(courseId: string) {
    const db = getDatabase();
    const lo = await (await get(child(ref(db), `all-course-access/${courseId}/lo`))).val();
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
          studentsOnlineList2.set([...this.los]);
          studentsOnline2.set(this.los.length);
        }
      }
    }
  },

  initService(course: Course) {
    const db = getDatabase();
    const statusRef = ref(db, `all-course-access/${course.id}/visits`);
    onValue(statusRef, async () => {
      if (!this.firstUpdate) {
        await this.visitUpdate(course.id);
      }
      this.firstUpdate = false;
    });
  },

  startPresenceEngine() {
    currentCourse.subscribe((newCourse: Course) => {
      if (newCourse && newCourse != this.lastCourse) {
        this.lastCourse = newCourse;
        if (isAuthenticated() && newCourse?.authLevel > 0) {
          this.initService(newCourse);
        }
      }
    });
  }
};
