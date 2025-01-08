import type { TutorsId } from "$lib/services/auth/types/tutors-id";
import type { Course, IconType, Lo } from "$lib/services/course/models/lo-types";

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
