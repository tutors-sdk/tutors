import PartySocket from "partysocket";
import type { Course, Lo } from "./models/lo-types";
import type { User } from "./types/auth";
import { currentCourse, studentsOnline, studentsOnlineList, coursesOnline, coursesOnlineList, allStudentsOnlineList, allStudentsOnline } from "$lib/stores";
import type { LoEvent, LoUser } from "./types/presence";
import { getKeys } from "$lib/environment";

const partyKitServer = getKeys().partyKit.mainRoom;

export const presenceService = {
  studentEventMap: new Map<string, LoEvent>(),
  studentLos: new Array<LoEvent>(),

  courseEventMap: new Map<string, LoEvent>(),
  courseLos: new Array<LoEvent>(),

  allStudentEventMap: new Map<string, LoEvent>(),
  allStudentLos: new Array<LoEvent>(),

  currentUserId: "",

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
    this.currentUserId = lo.user.id;
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
        if (this.currentUserId === nextLoEvent.user.id) return;
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
        const nextCourseEvent = JSON.parse(event.data);

        let courseEvent = this.courseEventMap.get(nextCourseEvent.courseId);

        if (!courseEvent) {
          this.courseLos.push(nextCourseEvent);
          this.courseEventMap.set(nextCourseEvent.courseId, nextCourseEvent);
        } else {
          refreshLoEvent(courseEvent, nextCourseEvent);
        }
        this.courseLos = [...this.courseLos];
        coursesOnlineList.set([...this.courseLos]);
        coursesOnline.set(this.courseLos.length);

        const nextStudentEvent = JSON.parse(event.data);
        let studentEvent = this.allStudentEventMap.get(nextStudentEvent.user.id);
        if (!studentEvent) {
          this.allStudentLos.push(nextStudentEvent);
          this.allStudentEventMap.set(nextStudentEvent.user.id, nextStudentEvent);
        } else {
          refreshLoEvent(studentEvent, nextStudentEvent);
        }
        this.allStudentLos = [...this.allStudentLos];
        allStudentsOnlineList.set([...this.allStudentLos]);
        allStudentsOnline.set(this.allStudentLos.length);
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
    fullName: "Anon",
    avatar: "https://tutors.dev/logo.svg",
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
