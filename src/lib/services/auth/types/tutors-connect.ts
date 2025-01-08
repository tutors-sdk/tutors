import type { Course } from "$lib/services/course/models/lo-types";
import type { CourseVisit, ProfileStore } from "./profile";
import type { TutorsId } from "./tutors-id";

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

  courseVisit(course: Course): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;

  learningEvent(params: Record<string, string>): void;
  startTimer(): void;
  stopTimer(): void;
}
