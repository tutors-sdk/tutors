/**
 * PartyKit-based implementation of the presence service
 * Uses WebSocket connections to track and broadcast user activity
 */

import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";

import type { Course, Lo } from "@tutors/tutors-model-lib";
import { rune, tutorsId } from "$lib/runes.svelte";
import { LoRecord, type LoUser, type PresenceService } from "../types.svelte";
import type { TutorsId } from "$lib/services/connect";
import { upsertTutorsConnectLatestLo } from "../utils/supabase-client";

// Server URL from environment variables
const partyKitServer = PUBLIC_party_kit_main_room;

export const presenceService: PresenceService = {
  // Initialize empty WebSocket connections - will be established on demand
  partyKitAll: <PartySocket>{},
  partyKitCourse: <PartySocket>{},
  listeningTo: "",
  // Use Svelte's rune for reactive state management
  studentsOnline: rune<LoRecord[]>([]),
  studentEventMap: new Map<string, LoRecord>(),

  studentListener(event: MessageEvent) {
    // Parse JSON data from WebSocket message with error handling
    let nextCourseEvent;
    try {
      nextCourseEvent = JSON.parse(event.data);
    } catch {
      return;
    }

    if (nextCourseEvent.type === "quiz:live-started") {
      this.onQuizStarted?.(nextCourseEvent);
      return;
    }

    // Only process events for current course and from other users
    if (nextCourseEvent.courseId === this.listeningTo) {
      // && nextCourseEvent.user.id !== tutorsId.value?.login) {
      const studentEvent = this.studentEventMap.get(nextCourseEvent.user.id);
      if (!studentEvent) {
        // First time seeing this student - add to online list
        const latestLo = new LoRecord(nextCourseEvent);
        this.studentsOnline.value.push(latestLo);
        this.studentEventMap.set(nextCourseEvent.user.id, latestLo);
      } else {
        // Update existing student's activity
        refreshLoRecord(studentEvent, nextCourseEvent);
      }
    }
  },

  connectToAllCourseAccess(): void {
    // Create WebSocket connection to global activity room
    this.partyKitAll = new PartySocket({
      host: partyKitServer,
      room: "tutors-all-course-access"
    });
  },

  startPresenceListener(courseId: string) {
    // Reset state before starting new listener
    this.studentsOnline.value = [];
    this.studentEventMap.clear();
    this.listeningTo = courseId;

    // Create course-specific WebSocket connection
    this.partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: courseId
    });
    // Bind event handler with correct 'this' context
    this.partyKitCourse.addEventListener("message", this.studentListener.bind(this));
  },

  sendLoEvent(course: Course, lo: Lo, student: TutorsId) {
    // Construct event data
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

    void upsertTutorsConnectLatestLo(loRecord);
  }
};

/**
 * Updates an existing LoRecord with new event data
 * @param loEvent - Existing record to update
 * @param nextLoEvent - New event data
 */
export function refreshLoRecord(loEvent: LoRecord, nextLoEvent: LoRecord) {
  loEvent.loRoute = nextLoEvent.loRoute;
  loEvent.title = nextLoEvent.title;
  loEvent.type = nextLoEvent.type;
  loEvent.user = nextLoEvent.user;
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
    id: getTutorsTimeId(),
    sentiment: "neutral"
  };
  if (tutorsId.share) {
    user.fullName = tutorsId.name;
    user.avatar = tutorsId.image;
    user.id = tutorsId.login;
    user.sentiment = tutorsId.sentiment ?? "neutral";
  }
  return user;
}

/**
 * Generates a unique identifier for anonymous users
 * @returns UUID v4 string
 */
function generateTutorsTimeId() {
  return crypto.randomUUID();
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
