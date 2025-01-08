/**
 * Real-time presence service using PartyKit for user activity tracking.
 * Manages WebSocket connections for both global and course-specific events.
 */

import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";

import type { Course, Lo } from "$lib/services/base/lo-types";
import { rune, tutorsId } from "$lib/runes.svelte";
import { LoRecord, type LoUser, type PresenceService } from "../types.svelte";
import type { TutorsId } from "$lib/services/connect";

/** PartyKit server URL from environment */
const partyKitServer = PUBLIC_party_kit_main_room;

export const presenceService: PresenceService = {
  /** Global PartyKit connection for all course events */
  partyKitAll: <PartySocket>{},
  /** Course-specific PartyKit connection */
  partyKitCourse: <PartySocket>{},
  /** Currently monitored course ID */
  listeningTo: "",
  /** Reactive array of currently online students */
  studentsOnline: rune<LoRecord[]>([]),
  /** Map of student events keyed by user ID */
  studentEventMap: new Map<string, LoRecord>(),

  /**
   * Handles incoming student activity events
   * Updates presence data for the current course
   * @param event - WebSocket message event containing student activity
   */
  studentListener(event: any) {
    const nextCourseEvent = JSON.parse(event.data);
    if (nextCourseEvent.courseId === this.listeningTo && nextCourseEvent.user.id !== tutorsId.value?.login) {
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

  /**
   * Establishes connection to global course activity room
   */
  connectToAllCourseAccess(): void {
    this.partyKitAll = new PartySocket({
      host: partyKitServer,
      room: "tutors-all-course-access"
    });
  },

  /**
   * Starts monitoring presence for a specific course
   * Clears previous state and establishes new WebSocket connection
   * @param courseId - Course to monitor
   */
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

  /**
   * Broadcasts a learning object interaction event
   * Sends to both global and course-specific channels
   * @param course - Current course
   * @param lo - Learning object being interacted with
   * @param student - Student performing the interaction
   */
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

/**
 * Updates an existing LoRecord with new event data
 * @param loEvent - Existing record to update
 * @param nextLoEvent - New event data
 */
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

/**
 * Creates a user object for presence tracking
 * Handles both authenticated and anonymous users
 * @param tutorsId - User identity information
 * @returns LoUser object for presence tracking
 */
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

/**
 * Generates a unique identifier for anonymous users
 * @returns UUID v4 string
 */
function generateTutorsTimeId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets or creates a persistent anonymous user identifier
 * @returns Stored or new UUID
 */
function getTutorsTimeId() {
  if (!window.localStorage.tutorsTimeId) {
    window.localStorage.tutorsTimeId = generateTutorsTimeId();
  }
  return window.localStorage.tutorsTimeId;
}
