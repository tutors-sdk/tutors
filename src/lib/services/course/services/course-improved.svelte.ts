/**
 * EXAMPLE: Improved Course Service with Error Handling
 * 
 * This is a demonstration of how the course service could be refactored
 * to use the new error handling system. This shows:
 * - Using custom error types (CourseError, NetworkError)
 * - Using fetchWithRetry for network requests
 * - Proper error propagation with context
 * - Type-safe error handling
 * 
 * To implement this:
 * 1. Replace the original course.svelte.ts with this version
 * 2. Update any dependent code to handle the new error types
 * 3. Test thoroughly to ensure backwards compatibility
 */

import { type Lo, type Course, type Lab, type Note, decorateCourseTree } from "@tutors/tutors-model-lib";
import { LiveLab } from "./live-lab";
import { markdownService } from "$lib/services/markdown";
import { currentCourse, currentLo, rune } from "$lib/runes.svelte";
import type { CourseService, LabService } from "../types";
import { 
  CourseError, 
  NetworkError, 
  fetchJsonWithRetry,
  handleError 
} from "$lib/services/errors";

export const courseServiceImproved: CourseService = {
  /** Cache of loaded courses indexed by courseId */
  courses: new Map<string, Course>(),
  /** Cache of live lab instances indexed by labId */
  labs: new Map<string, LiveLab>(),
  /** Cache of processed notes indexed by noteId */
  notes: new Map<string, Note>(),
  /** Current course URL */
  courseUrl: rune(""),

  /**
   * Fetches and caches a course by ID with improved error handling
   * @throws {CourseError} When course cannot be loaded
   * @throws {NetworkError} When network request fails
   */
  async getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    let course = this.courses.get(courseId);
    let courseUrl = courseId;

    function isValidURL(url: string): boolean {
      const urlPattern = /^(https?:\/\/)?([A-Za-z0-9.-]+\.[A-Za-z]{2,})(:[0-9]+)?(\/[A-Za-z0-9_.-]+)*(\/[A-Za-z0-9_.-]+\?[A-Za-z0-9_=-]+)?(#.*)?$/;
      return urlPattern.test(url);
    }

    if (!course) {
      // Determine course URL
      if (isValidURL(courseId)) {
        if (courseId.includes(".netlify.app")) {
          courseUrl = courseId;
          courseId = courseId.replace(".netlify.app", "");
        } else {
          courseUrl = courseId;
        }
      } else {
        courseUrl = `${courseId}.netlify.app`;
      }

      const fullUrl = `https://${courseUrl}/tutors.json`;

      try {
        // Use retry logic for fetching course data
        const data = await fetchJsonWithRetry<Course>(
          fullUrl,
          { method: 'GET' },
          { 
            maxRetries: 3,
            initialDelay: 1000,
            shouldRetry: (error, attempt) => {
              // Retry on network errors and 5xx errors
              if (error instanceof NetworkError) {
                const statusCode = error.statusCode;
                // Don't retry on 404 or other 4xx errors
                if (statusCode && statusCode >= 400 && statusCode < 500) {
                  return false;
                }
              }
              return attempt < 3;
            }
          }
        );

        course = data;
        decorateCourseTree(course, courseId, courseUrl);
        this.courses.set(courseId, course);

      } catch (error) {
        // Convert to CourseError with context
        if (error instanceof NetworkError) {
          if (error.statusCode === 404) {
            throw new CourseError(
              `Course not found: ${courseId}`,
              'COURSE_NOT_FOUND',
              { courseId, courseUrl, url: fullUrl }
            );
          }
          throw new CourseError(
            `Failed to load course: ${error.message}`,
            'COURSE_LOAD_FAILED',
            { courseId, courseUrl, originalError: error.code }
          );
        }
        
        throw new CourseError(
          `Unexpected error loading course: ${courseId}`,
          'COURSE_LOAD_FAILED',
          { courseId, courseUrl, error: String(error) }
        );
      }
    }

    return course;
  },

  /**
   * Loads a course and updates global state
   * @throws {CourseError} When course cannot be loaded
   */
  async readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId, fetchFunction);
    this.courseUrl.value = course.courseUrl;
    currentCourse.value = course;
    currentLo.value = course;
    return course;
  },

  /**
   * Loads a topic from a course
   * @throws {CourseError} When topic is not found
   */
  async readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const topic = course.topicIndex.get(topicId);
    
    if (!topic) {
      throw new CourseError(
        `Topic not found: ${topicId}`,
        'TOPIC_NOT_FOUND',
        { courseId, topicId }
      );
    }
    
    currentLo.value = topic;
    return topic;
  },

  /**
   * Creates or retrieves a LiveLab instance
   * @throws {CourseError} When lab is not found
   */
  async readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LabService> {
    const course = await this.readCourse(courseId, fetchFunction);

    const lastSegment = labId.substring(labId.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      labId = labId.slice(0, labId.lastIndexOf("/"));
    }

    let liveLab = this.labs.get(labId);
    if (!liveLab) {
      const lab = course.loIndex.get(labId) as Lab;
      
      if (!lab) {
        throw new CourseError(
          `Lab not found: ${labId}`,
          'LAB_NOT_FOUND',
          { courseId, labId }
        );
      }

      try {
        liveLab = new LiveLab(course, lab, labId);
        this.labs.set(labId, liveLab);
      } catch (error) {
        throw new CourseError(
          `Failed to initialize lab: ${labId}`,
          'LAB_INIT_FAILED',
          { courseId, labId, error: String(error) }
        );
      }
    }

    currentLo.value = liveLab.lab;
    return liveLab;
  },

  /**
   * Retrieves all learning objects of a specific type
   * @throws {CourseError} When wall data is not available
   */
  async readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]> {
    const course = await this.readCourse(courseId, fetchFunction);
    const wall = course.wallMap?.get(type);
    
    if (!wall) {
      throw new CourseError(
        `Wall not found for type: ${type}`,
        'WALL_NOT_FOUND',
        { courseId, type }
      );
    }
    
    return wall;
  },

  /**
   * Loads a specific learning object
   * @throws {CourseError} When learning object is not found
   */
  async readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const lo = course.loIndex.get(loId);
    
    if (!lo) {
      throw new CourseError(
        `Learning object not found: ${loId}`,
        'LO_NOT_FOUND',
        { courseId, loId }
      );
    }
    
    currentLo.value = lo;
    
    if (lo.type === "note") {
      try {
        this.notes.set(loId, lo as Note);
      } catch (error) {
        // Log error but don't fail the operation
        await handleError(error, { 
          context: 'readLo', 
          courseId, 
          loId, 
          type: 'note' 
        });
      }
    }
    
    return lo;
  },

  /**
   * Refreshes all cached labs and notes
   * Errors are logged but don't stop the refresh process
   */
  refreshAllLabs() {
    for (const liveLab of this.labs.values()) {
      try {
        markdownService.convertLabToHtml(liveLab.course, liveLab.lab, true);
        liveLab.convertMdToHtml();
        liveLab.refreshStep();
      } catch (error) {
        // Log error but continue with other labs
        handleError(error, {
          context: 'refreshAllLabs',
          labId: liveLab.lab.id
        });
      }
    }
    
    for (const note of this.notes.values()) {
      try {
        markdownService.convertNoteToHtml(currentCourse.value!, note, true);
      } catch (error) {
        // Log error but continue with other notes
        handleError(error, {
          context: 'refreshAllLabs',
          noteId: note.id
        });
      }
    }
  }
};

