/**
 * PartyKit-based implementation of LiveService
 * Uses WebSocket connections to track both course-specific and platform-wide activity
 */

import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { refreshLoRecord } from "./presence.svelte";
import { rune } from "$lib/runes.svelte";
import { LoRecord, type LiveService } from "../types.svelte";

// Server URL from environment variables
const partyKitServer = PUBLIC_party_kit_main_room;

// Initialize global WebSocket connection if server URL is configured
let partyKitAll = <PartySocket>{};
if (PUBLIC_party_kit_main_room !== "XXX") {
  partyKitAll = new PartySocket({
    host: partyKitServer,
    room: "tutors-all-course-access"
  });
}

export const liveService: LiveService = {
  // Initialize reactive state using Svelte runes
  listeningForCourse: rune<string>(""),
  coursesOnline: rune<LoRecord[]>([]),
  studentsOnline: rune<LoRecord[]>([]),

  // Maps for efficient event lookup and updates
  studentEventMap: new Map<string, LoRecord>(),
  courseEventMap: new Map<string, LoRecord>(),

  // Course-specific WebSocket connection - initialized on demand
  partyKitCourse: <PartySocket>{},
  listeningAll: false,

  studentListener(event: MessageEvent) {
    // Parse and extract student data
    const data = JSON.parse(event.data);
    const studentEvent = this.studentEventMap.get(data.user.id);

    if (!studentEvent) {
      // First time seeing this student
      const latestLo = new LoRecord(data);
      this.studentsOnline.value.push(latestLo);
      this.studentEventMap.set(data.user.id, latestLo);

    } else {
      // Update existing student record
      refreshLoRecord(studentEvent, data);
    }
  },

  courseListener(event: MessageEvent) {
    // Parse and extract course data
    const data = JSON.parse(event.data);
    const courseEvent = this.courseEventMap.get(data.courseId);

    if (!courseEvent) {
      // First activity in this course
      const latestLo = new LoRecord(data);
      this.coursesOnline.value.push(latestLo);
      this.courseEventMap.set(data.courseId, latestLo);
    } else {
      // Update existing course activity
      refreshLoRecord(courseEvent, data);
    }
  },

  partyKitListener(event: MessageEvent) {
    this.courseListener(event);
    this.studentListener(event);
  },

  startGlobalPresenceService() {
    // Only set up global listener once
    if (!this.listeningAll) {
      partyKitAll.addEventListener("message", this.partyKitListener.bind(this));
      this.listeningAll = true;
    }
  },

  startCoursePresenceListener(courseId: string) {
    // Reset state for new course
    this.listeningForCourse.value = courseId;
    this.studentsOnline.value = [];
    this.studentEventMap.clear();

    // Create new WebSocket connection for course
    this.partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: courseId
    });

    // Bind message handler with correct 'this' context
    this.partyKitCourse.addEventListener("message", this.studentListener.bind(this));
  }
};
