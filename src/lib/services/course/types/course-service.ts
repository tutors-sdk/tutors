import type { Course, Lo, Note } from "../models/lo-types";
import type { LiveLab } from "../services/live-lab";

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

  getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo>;
  readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LiveLab>;
  readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]>;
  readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo>;
  refreshAllLabs(codeTheme: string): void;
}
