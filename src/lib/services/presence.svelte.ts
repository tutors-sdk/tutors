import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { rune } from "./utils/runes.svelte";
import { LoRecord, type LoUser, type PresenceService, type TutorsId } from "./types.svelte";
import type { Course, Lo } from "./models/lo-types";
import { tutorsConnectService } from "./connect.svelte";

const partyKitServer = PUBLIC_party_kit_main_room;

export const presenceService: PresenceService = {
  partyKitAll: <PartySocket>{},
  partyKitCourse: <PartySocket>{},
  listeningTo: "",
  studentsOnline: rune<LoRecord[]>([]),
  studentEventMap: new Map<string, LoRecord>(),

  studentListener(event: any) {
    const nextCourseEvent = JSON.parse(event.data);
    if (
      nextCourseEvent.courseId === this.listeningTo &&
      nextCourseEvent.user.id !== tutorsConnectService.tutorsId.value.login
    ) {
      const studentEvent = this.studentEventMap.get(nextCourseEvent.user.id);
      if (!studentEvent) {
        const latestLo = new LoRecord(nextCourseEvent);
        this.studentsOnline.value.push(latestLo);
        this.studentEventMap.set(nextCourseEvent.user.id, latestLo);
      } else {
        refreshLoRecord(studentEvent, nextCourseEvent);
      }
    }
  },

  connectToAllCourseAccess(): void {
    this.partyKitAll = new PartySocket({
      host: partyKitServer,
      room: "tutors-all-course-access"
    });
  },

  startPresenceListener(courseId: string) {
    this.studentsOnline.value = [];
    this.studentEventMap.clear();
    this.listeningTo = courseId;
    this.partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: courseId
    });
    this.partyKitCourse.addEventListener("message", this.studentListener.bind(this));
  },

  sendLoEvent(course: Course, lo: Lo, student: TutorsId) {
    const loRecord: LoRecord = {
      courseId: course.courseId,
      courseUrl: course.courseUrl,
      img: lo.img,
      title: lo.title,
      courseTitle: course.title,
      loRoute: lo.route,
      user: getUser(student),
      type: lo.type,
      isPrivate: (course.properties?.private as unknown as number) === 1
    };
    if (lo.icon) {
      loRecord.icon = lo.icon;
    }
    const loRecordJson = JSON.stringify(loRecord);
    this.partyKitAll.send(loRecordJson);
    this.partyKitCourse.room = course.courseId;
    if (this.listeningTo !== "") {
      this.partyKitCourse.send(loRecordJson);
    }
  }
};

export function refreshLoRecord(loEvent: LoRecord, nextLoEvent: LoRecord) {
  loEvent.loRoute = `https://tutors.dev${nextLoEvent.loRoute}`;
  loEvent.title = nextLoEvent.title;
  loEvent.type = nextLoEvent.type;
  if (nextLoEvent.icon) {
    loEvent.icon = nextLoEvent.icon;
    loEvent.img = undefined;
  } else {
    loEvent.img = nextLoEvent.img;
    loEvent.icon = undefined;
  }
}

function getUser(tutorsId: TutorsId): LoUser {
  const user: LoUser = {
    fullName: "Anon",
    avatar: "https://tutors.dev/logo.svg",
    id: getTutorsTimeId()
  };
  if (tutorsId.share) {
    user.fullName = tutorsId.name;
    user.avatar = tutorsId.image;
    user.id = tutorsId.login;
  }
  return user;
}

function generateTutorsTimeId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getTutorsTimeId() {
  if (!window.localStorage.tutorsTimeId) {
    window.localStorage.tutorsTimeId = generateTutorsTimeId();
  }
  return window.localStorage.tutorsTimeId;
}
