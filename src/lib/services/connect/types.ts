import type { Course, IconType } from "@tutors/tutors-model-lib";

export const COURSE_SENTIMENT_IDS = ["neutral", "fine", "delighted", "confident", "overwhelmed", "confused", "drained", ] as const;
export type CourseSentimentId = (typeof COURSE_SENTIMENT_IDS)[number];

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
 * User identity information from authentication provider
 */
export type TutorsId = {
  name: string;
  login: string;
  email: string;
  image: string;
  share: string;
  sentiment: string;
};

/**
 * Service for managing user authentication and course access
 */
export interface TutorsConnectService {
  profile: ProfileStore;
  intervalId: any;
  anonMode: boolean;

  connect(redirectStr: string): void;
  reconnect(user: TutorsId): void;
  disconnect(redirectStr: string): void;
  toggleShare(): void;
  /** Persists sentiment locally and, when signed in, in tutors-connect-users. */
  updateSentiment(sentiment: string): Promise<void>;

  courseVisit(course: Course): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;

  learningEvent(params: Record<string, string>): void;
  startTimer(): void;
  stopTimer(): void;
  
  checkWhiteList(): void;
}
