import type { TutorsId } from "$lib/services/connect";
import type { Course, IconType, Lo } from "$lib/services/base/lo-types";

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
 */
export interface PresenceService {
  /** Currently online students */
  studentsOnline: any;
  /** Global PartyKit connection */
  partyKitAll: any;
  /** Course-specific PartyKit connection */
  partyKitCourse: any;
  /** Map of student events */
  studentEventMap: Map<string, LoRecord>;
  /** Currently monitored course ID */
  listeningTo: string;

  studentListener(event: any): void;
  sendLoEvent(course: Course, lo: Lo, student: TutorsId): void;
  connectToAllCourseAccess(): void;
  startPresenceListener(courseId: string): void;
}

/**
 * Service for managing real-time course interactions and student presence
 */
export interface LiveService {
  listeningForCourse: { value: string };
  coursesOnline: { value: LoRecord[] };
  studentsOnline: { value: LoRecord[] };
  studentsOnlineByCourse: { value: LoRecord[][] };
  studentEventMap: Map<string, LoRecord>;
  courseEventMap: Map<string, LoRecord>;
  partyKitCourse: any;
  listeningAll: boolean;

  groupedStudentListener(event: any): void;
  studentListener(event: any): void;
  courseListener(event: any): void;
  partyKitListener(event: any): void;
  startGlobalPresenceService(): void;
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
