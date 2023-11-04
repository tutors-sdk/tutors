import PartySocket from "partysocket";
import type { Course, Lo } from "./models/lo-types";
import type { User } from "./types/auth";
import { currentCourse, studentsOnline, studentsOnlineList, coursesOnline, coursesOnlineList } from "$lib/stores";
import type { LoEvent, LoUser } from "./types/presence";

const partyKitServer = "https://tutors-party.edeleastar.partykit.dev";

export const presenceService = {
  studentEventMap: new Map<string, LoEvent>(),
  studentLos: new Array<LoEvent>(),

  courseEventMap: new Map<string, LoEvent>(),
  courseLos: new Array<LoEvent>(),

  partyKitCourse: <PartySocket>{},
  partyKitAll: new PartySocket({
    host: partyKitServer,
    room: "tutors-all-course-access"
  }),

  sendLoEvent(course: Course, currentLo: Lo, onlineStatus: boolean, userDetails: User) {
    const lo: LoEvent = {
      courseId: course.courseId,
      courseUrl: course.courseUrl,
      img: currentLo.img,
      title: currentLo.title,
      courseTitle: course.title,
      loRoute: currentLo.route,
      user: getUser(onlineStatus, userDetails),
      isPrivate: (course.properties?.private as unknown as number) === 1
    };
    if (currentLo.icon) {
      lo.icon = currentLo.icon;
    }
    const loJson = JSON.stringify(lo);
    this.partyKitAll.send(loJson);
    this.partyKitCourse.room = course.courseId;
    if (this.partyKitCourse) {
      this.partyKitCourse.send(loJson);
    }
  },

  startPresenceService(course: Course) {
    const partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: course.courseId
    });
    partyKitCourse.addEventListener("message", (event) => {
      try {
        const nextLoEvent = JSON.parse(event.data);
        let loEvent = this.studentEventMap.get(nextLoEvent.user.id);
        if (!loEvent) {
          this.studentLos.push(nextLoEvent);
          this.studentEventMap.set(nextLoEvent.user.id, nextLoEvent);
        } else {
          refreshLoEvent(loEvent, nextLoEvent);
        }
        this.studentLos = [...this.studentLos];
        studentsOnlineList.set([...this.studentLos]);
        studentsOnline.set(this.studentLos.length);
      } catch (e) {
        console.log(e);
      }
    });
  },

  startGlobalPresenceService() {
    this.partyKitAll.addEventListener("message", (event) => {
      try {
        const nextLoEvent = JSON.parse(event.data);
        let loEvent = this.courseEventMap.get(nextLoEvent.courseId);
        if (!loEvent) {
          this.courseLos.push(nextLoEvent);
          this.courseEventMap.set(nextLoEvent.courseId, nextLoEvent);
        } else {
          refreshLoEvent(loEvent, nextLoEvent);
        }
        this.courseLos = [...this.courseLos];
        coursesOnlineList.set([...this.courseLos]);
        coursesOnline.set(this.courseLos.length);
      } catch (e) {
        console.log(e);
      }
    });
  }
};

function refreshLoEvent(loEvent: LoEvent, nextLoEvent: LoEvent) {
  loEvent.loRoute = `https://tutors.dev${nextLoEvent.loRoute}`;
  loEvent.title = nextLoEvent.title;
  if (nextLoEvent.icon) {
    loEvent.icon = nextLoEvent.icon;
    loEvent.img = undefined;
  } else {
    loEvent.img = nextLoEvent.img;
    loEvent.icon = undefined;
  }
}

currentCourse.subscribe((current) => {
  if (current) {
    presenceService.partyKitCourse = new PartySocket({
      host: "https://tutors-party.edeleastar.partykit.dev",
      room: current.courseId
    });
  }
});

function getUser(onlineStatus: boolean, userDetails: User): LoUser {
  const user: LoUser = {
    fullName: "anonymous",
    avatar: "none",
    id: getTutorsTimeId()
  };
  if (userDetails && onlineStatus) {
    user.fullName = userDetails.user_metadata.full_name ? userDetails.user_metadata.full_name : userDetails.user_metadata.user_name;
    user.avatar = userDetails.user_metadata.avatar_url;
    user.id = userDetails.user_metadata.user_name;
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
