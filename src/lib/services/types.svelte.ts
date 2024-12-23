import type { LiveLab } from "./models/live-lab";
import type { Course, IconType, Lab, Lo, Note } from "./models/lo-types";

export type TutorsId = {
  name: string;
  login: string;
  email: string;
  image: string;
  share: string;
};

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

export interface LoUser {
  fullName: string;
  avatar: string;
  id: string;
}

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

export interface CourseService {
  courses: Map<string, Course>;
  labs: Map<string, LiveLab>;
  notes: Map<string, Note>;
  courseUrl: "";

  getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo>;
  readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LiveLab>;
  readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]>;
  readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo>;
  refreshAllLabs(codeTheme: string): void;
}

export interface ProfileStore {
  courseVisits: CourseVisit[];

  reload(): void;
  save(): void;
  logCourseVisit(course: Course): void;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
}

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

export interface AnalyticsService {
  loRoute: string;

  learningEvent(course: Course, params: Record<string, unknown>, lo: Lo, student: TutorsId): void;
  reportPageLoad(course: Course, lo: Lo, student: TutorsId): void;
  updatePageCount(course: Course, lo: Lo, student: TutorsId): void;
  updateLogin(courseId: string, session: any): void;
}

export interface PresenceService {
  studentsOnline: any;
  partyKitAll: any;
  partyKitCourse: any;
  studentEventMap: Map<string, LoRecord>;
  listeningTo: string;

  studentListener(event: any): void;
  sendLoEvent(course: Course, lo: Lo, student: TutorsId): void;
  connectToAllCourseAccess(): void;
  startPresenceListener(courseId: string): void;
}

export interface MarkdownService {
  codeThemes: any;
  setCodeTheme(theme: string): void;
  convertLabToHtml(course: Course, lab: Lab, refreshOnly?: boolean): void;
  convertNoteToHtml(course: Course, note: Note, refreshOnly?: boolean): void;
  convertLoToHtml(course: Course, lo: Lo): void;
  replaceAll(str: string, find: string, replace: string): string;
  filter(src: string, url: string): string;
}
