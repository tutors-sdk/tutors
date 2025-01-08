import type { Course, Lab, Lo, Note } from "$lib/services/base/lo-types";

/**
 * Interface representing a live interactive lab session
 * Manages lab content, navigation, and state
 */
export interface LabService {
  course: Course;
  lab: Lab;
  url: string;
  objectivesHtml: string;
  currentChapterShortTitle: string;
  currentChapterTitle: string;
  navbarHtml: string;
  horizontalNavbarHtml: string;
  content: string;
  chaptersHtml: Map<string, string>;
  chaptersTitles: Map<string, string>;
  steps: string[];
  index: number;
  autoNumber: boolean;
  vertical: boolean;

  convertMdToHtml(): void;
  refreshStep(): void;
  refreshNav(): void;
  setCurrentChapter(step: string): void;
  setFirstPageActive(): void;
  setActivePage(step: string): void;
  nextStep(): string;
  prevStep(): string;
}

/**
 * Service for managing course content and navigation
 */
export interface CourseService {
  /** Cache of loaded courses */
  courses: Map<string, Course>;
  /** Cache of live lab instances */
  labs: Map<string, LabService>;
  /** Cache of processed notes */
  notes: Map<string, Note>;
  /** Current course URL */
  courseUrl: any;

  getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo>;
  readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LabService>;
  readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]>;
  readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo>;
  refreshAllLabs(codeTheme: string): void;
}
