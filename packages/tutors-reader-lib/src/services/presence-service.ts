import { Course } from "../models/course";
import { currentCourse, currentUser, studentsOnline, studentsOnlineList } from "tutors-reader-lib/src/stores/stores";
import type { StudentLoEvent } from "../types/metrics-types";
import { decrypt, isAuthenticated } from "../utils/auth-utils";
import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
import { readObj, sanitise } from "../utils/firebase-utils";
import type { User } from "src/types/auth-types";

let canUpdate = false;

export const presenceService = {
  db: {},
  user: {},
  course: Course,
  lastCourse: Course,
  students: new Map<string, StudentLoEvent>(),
  los: [],

  sweepAndPurge() {
    this.los.forEach((lo, index, obj) => {
      lo.timeout--;
      if (lo.timeout == 0) {
        obj.splice(index, 1);
        this.students.delete(lo.studentId);
        studentsOnlineList.set([...this.los]);
        studentsOnline.set(this.los.length);
      }
    });
  },

  async visitUpdate(courseId: string) {
    const lo = await (await get(child(ref(this.db), `all-course-access/${courseId}/lo`))).val();
    if (lo) {
      const userId = decrypt(lo.tutorsTimeId);
      if (userId && this.user.email !== userId) {
        const user = await readObj(`${courseId}/users/${sanitise(userId)}`);
        if (user) {
          const event: StudentLoEvent = {
            studentName: user.name,
            studentId: userId,
            studentImg: user.picture,
            courseTitle: lo.courseTitle,
            loTitle: lo.title,
            loImage: lo.img,
            loRoute: lo.subRoute,
            loIcon: lo.icon,
            timeout: 5
          };
          const studentUpdate = this.students.get(userId);
          if (!studentUpdate) {
            this.students.set(userId, event);
            this.los.push(event);
          } else {
            studentUpdate.loTitle = event.loTitle;
            studentUpdate.loImage = event.loImage;
            studentUpdate.loRoute = event.loRoute;
            studentUpdate.loIcon = event.loIcon;
            studentUpdate.timeout = 5;
          }
          studentsOnlineList.set([...this.los]);
          studentsOnline.set(this.los.length);
        }
      }
    }
  },

  initService(course: Course) {
    setInterval(this.sweepAndPurge.bind(this), 1000 * 60);
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
    currentUser.subscribe((newUser: User) => {
      this.user = newUser;
    });
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
