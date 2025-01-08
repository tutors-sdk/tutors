import PartySocket from "partysocket";

import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { rune } from "./utils/runes.svelte";
import { LoRecord } from "./types.svelte";
import { refreshLoRecord } from "./community/services/presence.svelte";

/** PartyKit server URL from environment */
const partyKitServer = PUBLIC_party_kit_main_room;

let partyKitAll = <PartySocket>{};

if (PUBLIC_party_kit_main_room !== "XXX") {
  partyKitAll = new PartySocket({
    host: partyKitServer,
    room: "tutors-all-course-access"
  });
}

export const liveService = {
  listeningForCourse: rune<string>(""),
  coursesOnline: rune<LoRecord[]>([]),
  studentsOnline: rune<LoRecord[]>([]),
  studentsOnlineByCourse: rune<LoRecord[][]>([]),

  studentEventMap: new Map<string, LoRecord>(),
  courseEventMap: new Map<string, LoRecord>(),

  partyKitCourse: <PartySocket>{},
  listeningAll: false,

  groupedStudentListener(event: any) {
    const courseArray = this.studentsOnlineByCourse.value.find((lo: LoRecord[]) => lo[0].courseId === event.courseId);
    if (!courseArray) {
      const studentArray = new Array<LoRecord>();
      studentArray.push(new LoRecord(event));
      this.studentsOnlineByCourse.value.push(studentArray);
    } else {
      const loStudent = courseArray.find((lo: LoRecord) => lo.user?.id === event.user.id);
      if (!loStudent) {
        courseArray.push(new LoRecord(event));
      } else {
        refreshLoRecord(loStudent, event);
      }
    }
  },

  studentListener(event: any) {
    const studentEvent = this.studentEventMap.get(event.user.id);
    if (!studentEvent) {
      const latestLo = new LoRecord(event);
      this.studentsOnline.value.push(latestLo);
      this.studentEventMap.set(event.user.id, latestLo);
    } else {
      refreshLoRecord(studentEvent, event);
    }
  },

  courseListener(event: any) {
    const courseEvent = this.courseEventMap.get(event.courseId);
    if (!courseEvent) {
      const latestLo = new LoRecord(event);
      this.coursesOnline.value.push(latestLo);
      this.courseEventMap.set(event.courseId, latestLo);
    } else {
      refreshLoRecord(courseEvent, event);
    }
  },
  partyKitListener(event: any) {
    try {
      const nextCourseEvent = JSON.parse(event.data);
      this.courseListener(nextCourseEvent);
      this.studentListener(nextCourseEvent);
      this.groupedStudentListener(nextCourseEvent);
    } catch (e) {
      console.log(e);
    }
  },

  startGlobalPresenceService() {
    if (!this.listeningAll) {
      this.listeningAll = true;
      partyKitAll.addEventListener("message", (event) => {
        this.partyKitListener(event);
      });
    }
  },

  startCoursePresenceListener(courseId: string) {
    const partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: courseId
    });
    partyKitCourse.addEventListener("message", (event) => {
      try {
        const nextCourseEvent = JSON.parse(event.data);
        this.listeningForCourse.value = nextCourseEvent.courseTitle;
        this.groupedStudentListener(nextCourseEvent);
      } catch (e) {
        console.log(e);
      }
    });
  }
};
