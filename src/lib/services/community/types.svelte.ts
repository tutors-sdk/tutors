import type { TutorsId } from "$lib/services/connect";
import type { Course, IconType, Lo } from "$lib/services/base/lo-types";
import PartySocket from "partysocket";
/**
 * Minimal user information for learning object interactions
 */
export interface LoUser {
  fullName: string;
  avatar: string;
  id: string;
}

/**
 * Record of user interaction with a learning object
 * Uses Svelte's state management for reactivity
 */
export class LoRecord {
  courseId: string = $state("");
  courseUrl: string = $state("");
  courseTitle: string = $state("");
  loRoute: string = $state("");
  title: string = $state("");
  img?: string = $state("");
  icon?: IconType = $state();
  isPrivate: boolean = $state(false);
  user?: LoUser = $state<LoUser | undefined>();
  type: string = $state("");

  constructor(data: any) {
    Object.assign(this, data);
  }
}

/**
 * Service for managing real-time user presence and interactions
 * Tracks student activity and broadcasts learning object interactions
 */
export interface PresenceService {
  /** Currently online students in the active course */
  studentsOnline: { value: LoRecord[] };
  /** Connection for all course events across the platform */
  partyKitAll: PartySocket;
  /** Connection for events specific to the current course */
  partyKitCourse: PartySocket;
  /** Lookup table for quick access to student events */
  studentEventMap: Map<string, LoRecord>;
  /** ID of the course currently being monitored */
  listeningTo: string;

  /**
   * Process incoming student activity messages
   * @param event - WebSocket message with student activity data
   */
  studentListener(event: MessageEvent): void;

  /**
   * Notify other users about learning object interaction
   * @param course - Course being accessed
   * @param lo - Learning object being viewed
   * @param student - Student viewing the content
   */
  sendLoEvent(course: Course, lo: Lo, student: TutorsId): void;

  /**
   * Begin monitoring platform-wide course activity
   */
  connectToAllCourseAccess(): void;

  /**
   * Begin monitoring activity in a specific course
   * @param courseId - Identifier of course to monitor
   */
  startPresenceListener(courseId: string): void;
}

/**
 * Service for managing real-time course interactions and student presence
 * Provides course-wide and platform-wide activity monitoring
 */
export interface LiveService {
  /** Currently monitored course identifier */
  listeningForCourse: { value: string };
  /** List of courses with active users */
  coursesOnline: { value: LoRecord[] };
  /** List of all active students in current course */
  studentsOnline: { value: LoRecord[] };
  /** Active students grouped by their courses */
  studentsOnlineByCourse: { value: LoRecord[][] };
  /** Quick lookup for student activity by ID */
  studentEventMap: Map<string, LoRecord>;
  /** Quick lookup for course activity by ID */
  courseEventMap: Map<string, LoRecord>;
  /** Connection for course-specific events */
  partyKitCourse: PartySocket;
  /** Flag indicating if global monitoring is active */
  listeningAll: boolean;

  /**
   * Process student activity for course grouping
   * @param event - WebSocket message containing student activity
   */
  groupedStudentListener(event: MessageEvent): void;

  /**
   * Process individual student activity
   * @param event - WebSocket message containing student update
   */
  studentListener(event: MessageEvent): void;

  /**
   * Process course-level activity
   * @param event - WebSocket message containing course update
   */
  courseListener(event: MessageEvent): void;

  /**
   * Handle incoming WebSocket messages
   * @param event - WebSocket message to process
   */
  partyKitListener(event: MessageEvent): void;

  /**
   * Begin monitoring platform-wide activity
   */
  startGlobalPresenceService(): void;

  /**
   * Begin monitoring activity in a specific course
   * @param courseId - Course to monitor
   */
  startCoursePresenceListener(courseId: string): void;
}

/**
 * Service for tracking user interactions and learning analytics
 */
export interface AnalyticsService {
  loRoute: string;

  learningEvent(course: Course, params: Record<string, unknown>, lo: Lo, student: TutorsId): void;
  reportPageLoad(course: Course, lo: Lo, student: TutorsId): void;
  updatePageCount(course: Course, lo: Lo, student: TutorsId): void;
  updateLogin(courseId: string, session: any): void;
}

export interface CatalogueEntry {
  course_id: string;
  visited_at: Date;
  visit_count: number;
  course_record: any;
}

/**
 * Service for managing course catalogue data
 */
export interface CatalogueService {
  getCatalogue(): Promise<CatalogueEntry[]>;
  getCatalogueCount(): Promise<number>;
  getStudentCount(): Promise<number>;
}
