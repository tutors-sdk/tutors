import PartySocket from "partysocket";
import type { Course, Lo } from "./models/lo-types";
import type { User } from "./types/auth";
import { currentCourse, studentsOnline, studentsOnlineList } from "$lib/stores";
import type { LoEvent, LoUser } from "./types/presence";

const partyKitAll = new PartySocket({
  host: "https://tutors-party.edeleastar.partykit.dev",
  room: "tutors-all-course-access"
});

let partyKitCourse: PartySocket;
currentCourse.subscribe((current) => {
  if (current) {
    partyKitCourse = new PartySocket({
      host: "https://tutors-party.edeleastar.partykit.dev",
      room: current.courseId
    });
  }
});

export function refreshLoEvent(loEvent: LoEvent, nextLoEvent: LoEvent) {
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

function getUser(onlineStatus: boolean, userDetails: User): LoUser {
  const user: LoUser = {
    fullName: "anonymous",
    avatar: "none",
    id: getTutorsTimeId()
  };
  if (userDetails && onlineStatus) {
    user.fullName = userDetails.user_metadata.full_name ? userDetails.user_metadata.full_name : userDetails.user_metadata.user_name;
    (user.avatar = userDetails.user_metadata.avatar_url), (user.id = userDetails.user_metadata.user_name);
  }
  return user;
}

export function sendLoEvent(course: Course, currentLo: Lo, onlineStatus: boolean, userDetails: User) {
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
  partyKitAll.send(loJson);
  partyKitCourse.room = course.courseId;
  if (partyKitCourse) {
    partyKitCourse.send(loJson);
  }
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

const loEventMap = new Map<string, LoEvent>();
let los: LoEvent[] = [];

export function startPresenceService(course: Course) {
  const partyKitCourse = new PartySocket({
    host: "https://tutors-party.edeleastar.partykit.dev",
    room: course.courseId
  });
  partyKitCourse.addEventListener("message", (event) => {
    try {
      const nextLoEvent = JSON.parse(event.data);
      let loEvent = loEventMap.get(nextLoEvent.user.id);
      if (!loEvent) {
        los.push(nextLoEvent);
        loEventMap.set(nextLoEvent.user.id, nextLoEvent);
      } else {
        refreshLoEvent(loEvent, nextLoEvent);
      }
      los = [...los];
      studentsOnlineList.set([...los]);
      studentsOnline.set(los.length);
    } catch (e) {
      console.log(e);
    }
  });
}
