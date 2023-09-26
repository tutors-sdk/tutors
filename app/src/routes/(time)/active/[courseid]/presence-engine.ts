import { child, get, getDatabase, onValue, ref, off } from "firebase/database";
import { studentsOnline, studentsOnlineList } from "./stores";
import type { Course } from "$lib/services/models/lo-types";
import type { User, UserSummary } from "$lib/services/types/auth";
import type { StudentLoEvent } from "$lib/services/types/metrics";

let canUpdate = false;

export const presenceService = {
  db: {},
  user: <User>{},
  userSummaryCache: new Map<string, UserSummary>(),
  course: <Course>{},
  lastCourse: <Course>{},
  students: new Map<string, StudentLoEvent>(),
  los: new Array<StudentLoEvent>(),

  sweepAndPurge(): void {
    const losToDelete: StudentLoEvent[] = [];
    this.los.forEach((lo) => {
      lo.timeout--;
      if (lo.timeout === 0) {
        losToDelete.push(lo);
      }
    });
    losToDelete.forEach((lo) => {
      const index = this.los.indexOf(lo);
      if (index !== -1) {
        this.los.splice(index, 1);
      }
      this.students.delete(lo.studentId);
    });

    studentsOnlineList.set([...this.los]);
    studentsOnline.set(this.los.length);
  },

  async visitUpdate(courseId: string) {
    const lo = await (await get(child(ref(this.db), `all-course-access/${courseId}/learningEvent`))).val();
    if (lo && lo.user && lo.user.fullName != "anonymous") {
      const event: StudentLoEvent = {
        studentName: lo.user.fullName,
        studentId: lo.user.id,
        studentImg: lo.user.avatar,
        courseTitle: lo.courseTitle,
        loTitle: lo.title,
        loImage: lo.img,
        loRoute: lo.subRoute,
        loIcon: lo.icon,
        timeout: 7
      };
      const studentUpdate = this.students.get(event.studentId);
      if (!studentUpdate) {
        this.students.set(event.studentId, event);
        this.los.push(event);
      } else {
        studentUpdate.loTitle = event.loTitle;
        studentUpdate.loImage = event.loImage;
        studentUpdate.loRoute = event.loRoute;
        studentUpdate.loIcon = event.loIcon;
        studentUpdate.timeout = 7;
      }
      studentsOnlineList.set([...this.los]);
      studentsOnline.set(this.los.length);
    }
  },

  initService(course: Course) {
    this.db = getDatabase();
    setInterval(this.sweepAndPurge.bind(this), 1000 * 60);
    studentsOnline.set(0);
    studentsOnlineList.set([]);
    canUpdate = false;
    setTimeout(function () {
      canUpdate = true;
    }, 5000);
    // @ts-ignore
    let statusRef = ref(this.db, `all-course-access/${course.courseId}/visits`);
    onValue(statusRef, async () => {
      if (canUpdate) {
        await this.visitUpdate(course.courseId);
      }
    });
    // @ts-ignore
    statusRef = ref(this.db, `all-course-access/${course.courseId}/count`);
    onValue(statusRef, async () => {
      if (canUpdate) {
        await this.visitUpdate(course.courseId);
      }
    });
  }
};
