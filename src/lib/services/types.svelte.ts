/**
 * Core type definitions for the Tutors application.
 * Defines interfaces for services, data models, and user interactions.
 */

import type { LiveLab } from "./models/live-lab";
import type { Course, IconType, Lab, Lo, Note, Theme } from "./models/lo-types";

/**
 * User identity information from authentication provider
 */
export type TutorsId = {
  name: string;
  login: string;
  email: string;
  image: string;
  share: string;
};

/**
 * Record of a user's interaction with a course
 */
export type CourseVisit = {
  id: string;
  title: string;
  img?: string;
  icon?: IconType;
  lastVisit: Date;
  credits: string;
  visits?: number;
  private: boolean;
  favourite: boolean;
};

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
 * Display information for course/topic/lab cards
 */
export interface CardDetails {
  route: string;
  title: string;
  type: string;
  subtitle1?: string;
  subtitle2?: string;
  summary?: string;
  icon?: IconType;
  img?: string;
  student?: LoUser;
  video?: string;
}

/**
 * Service for managing course content and navigation
 */
export interface CourseService {
  /** Cache of loaded courses */
  courses: Map<string, Course>;
  /** Cache of live lab instances */
  labs: Map<string, LiveLab>;
  /** Cache of processed notes */
  notes: Map<string, Note>;
  /** Current course URL */
  courseUrl: any;
  /** Currently loaded Lo (Learning Object) */
  currentLo: any;
  /** Currently loaded course */
  currentCourse: any;

  getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo>;
  readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LiveLab>;
  readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]>;
  readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo>;
  refreshAllLabs(codeTheme: string): void;
}

/**
 * Service for managing user profile data and course interactions
 */
export interface ProfileStore {
  /** List of courses visited by user */
  courseVisits: CourseVisit[];

  reload(): void;
  save(): void;
  logCourseVisit(course: Course): void;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
}

/**
 * Service for managing user authentication and course access
 */
export interface TutorsConnectService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutorsId: any;
  profile: ProfileStore;
  intervalId: any;
  anonMode: boolean;

  connect(redirectStr: string): void;
  reconnect(user: TutorsId): void;
  disconnect(redirectStr: string): void;
  toggleShare(): void;

  courseVisit(course: Course, user: TutorsId): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;

  learningEvent(params: Record<string, string>): void;
  startTimer(): void;
  stopTimer(): void;
}

/**
 * Service for tracking user interactions and learning analytics
 */
export interface AnalyticsService {
  /** Current learning object route being tracked */
  loRoute: string;

  learningEvent(course: Course, params: Record<string, unknown>, lo: Lo, student: TutorsId): void;
  reportPageLoad(course: Course, lo: Lo, student: TutorsId): void;
  updatePageCount(course: Course, lo: Lo, student: TutorsId): void;
  updateLogin(courseId: string, session: any): void;
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
 * Service for processing and rendering markdown content
 */
export interface MarkdownService {
  /** Available syntax highlighting themes */
  codeThemes: any;

  setCodeTheme(theme: string): void;
  convertLabToHtml(course: Course, lab: Lab, refreshOnly?: boolean): void;
  convertNoteToHtml(course: Course, note: Note, refreshOnly?: boolean): void;
  convertLoToHtml(course: Course, lo: Lo): void;
  replaceAll(str: string, find: string, replace: string): string;
  filter(src: string, url: string): string;
}

/**
 * Service for theme management and icon customization
 */
export interface ThemeService {
  /** Available themes with their icon libraries */
  themes: Theme[];
  /** current theme */
  currentTheme: any;
  /** display modes */
  layout: any;
  lightMode: any;
  /** Tracks if festive snow animation is active */
  isSnowing: boolean;

  initDisplay(forceTheme?: string, forceMode?: string): void;
  setDisplayMode(mode: string): void;
  toggleDisplayMode(): void;
  setTheme(theme: string): void;
  setLayout(layout: string): void;
  toggleLayout(): void;
  getIcon(type: string): IconType;
  addIcon(type: string, icon: IconType): void;
  getTypeColour(type: string): string;
  eventTrigger(): void;
}
