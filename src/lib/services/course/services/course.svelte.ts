/**
 * Core service for managing course content and navigation.
 * Handles course loading, caching, and content transformation.
 */

import type { Lo, Course, Lab, Note } from "@tutors/tutors-model-lib";
import { LiveLab } from "./live-lab";
import { LiveNotebook } from "./live-notebook";
import { markdownService } from "$lib/services/markdown";
import { courseProtocol, currentCourse, currentLo, rune } from "$lib/runes.svelte";
import type { CourseService, LabService, NotebookService } from "../types";
import type { NotebookLo } from "$lib/types/notebook-types";
import { decorateCourseTree, determineCourseUrl } from "./lo-tree";
import log from "$lib/services/logger";

export const courseService: CourseService = {
  /** Cache of loaded courses indexed by courseId */
  courses: new Map<string, Course>(),
  /** Cache of live lab instances indexed by labId */
  labs: new Map<string, LiveLab>(),
  /** Cache of processed notes indexed by noteId */
  notes: new Map<string, Note>(),
  /** Cache of live notebook instances indexed by notebookId */
  notebooks: new Map<string, LiveNotebook>(),
  /** Cache of processed quizzes indexed by route */
  quizzes: new Map<string, Lo>(),
  /** Current course URL */
  courseUrl: rune(""),

  /**
   * Fetches and caches a course by ID. Handles both direct URLs and Netlify domains.
   * @param courseId - Course identifier
   * @param fetchFunction - Fetch implementation for HTTP requests
   * @returns Promise resolving to the loaded Course
   */
  async getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    let course = this.courses.get(courseId);

    if (!course) {
      const { courseId: normalizedCourseId, courseUrl } = determineCourseUrl(courseId);
      courseId = normalizedCourseId;

      try {
        const response = await fetchFunction(`${courseProtocol.value}${courseUrl}/tutors.json`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        course = data as Course;
        decorateCourseTree(course, courseId, courseUrl);
        this.courses.set(courseId, course);
      } catch (error) {
        log.error(`Error fetching from URL: https://${courseUrl}/tutors.json`);
        log.error(error);
        throw error;
      }
    }

    return course;
  },

  /**
   * Loads a course and updates global state
   * @param courseId - Course identifier
   * @param fetchFunction - Fetch implementation
   * @returns Promise resolving to the loaded Course
   */
  async readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId, fetchFunction);
    this.courseUrl.value = course.courseUrl;
    currentCourse.value = course;
    currentLo.value = course;
    return course;
  },

  /**
   * Loads a topic from a course and updates current learning object
   * @param courseId - Course identifier
   * @param topicId - Topic identifier
   * @param fetchFunction - Fetch implementation
   * @returns Promise resolving to the topic
   */
  async readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const topic = course.topicIndex.get(topicId);
    if (topic) {
      currentLo.value = topic;
    }
    return topic ?? course;
  },

  /**
   * Creates or retrieves a LiveLab instance for a lab
   * @param courseId - Course identifier
   * @param labId - Lab identifier
   * @param fetchFunction - Fetch implementation
   * @returns Promise resolving to LiveLab instance
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
      markdownService.convertLabToHtml(course, lab);
      liveLab = new LiveLab(course, lab, labId);
      this.labs.set(labId, liveLab);
    }

    currentLo.value = liveLab.lab;
    return liveLab;
  },

  /**
   * Reads and caches a notebook, creating a LiveNotebook instance
   * @param courseId - Course identifier
   * @param notebookId - Notebook path/identifier
   * @param fetchFunction - Fetch implementation for HTTP requests
   * @returns Promise resolving to the LiveNotebook instance
   */
  async readNotebook(courseId: string, notebookId: string, fetchFunction: typeof fetch): Promise<NotebookService> {
    const course = await this.readCourse(courseId, fetchFunction);

    let liveNotebook = this.notebooks.get(notebookId);
    if (!liveNotebook) {
      const notebook = course.loIndex.get(notebookId) as NotebookLo;
      markdownService.convertNotebookToHtml(course, notebook);
      liveNotebook = new LiveNotebook(course, notebook, notebookId);
      this.notebooks.set(notebookId, liveNotebook);
    }

    currentLo.value = liveNotebook.notebook;
    return liveNotebook;
  },

  /**
   * Retrieves all learning objects of a specific type from a course
   * @param courseId - Course identifier
   * @param type - Type of learning objects to retrieve
   * @param fetchFunction - Fetch implementation
   * @returns Promise resolving to array of learning objects
   */
  async readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]> {
    const course = await this.readCourse(courseId, fetchFunction);
    const wall = course.wallMap?.get(type);
    return wall ?? [];
  },

  /**
   * Loads a specific learning object and processes it if needed
   * @param courseId - Course identifier
   * @param loId - Learning object identifier
   * @param fetchFunction - Fetch implementation
   * @returns Promise resolving to the learning object
   */
  async readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const lo = course.loIndex.get(loId);
    if (lo) {
      currentLo.value = lo;
    }
    if (lo?.type === "note") {
      if (!this.notes.has(loId)) {
        markdownService.convertNoteToHtml(course, lo as Note);
        this.notes.set(loId, lo as Note);
      }
    }
    if (lo?.type === "notebook") {
      if (!this.notebooks.has(loId)) {
        markdownService.convertNotebookToHtml(course, lo);
        const liveNotebook = new LiveNotebook(course, lo as NotebookLo, loId);
        this.notebooks.set(loId, liveNotebook);
      }
    }
    if (lo?.type === "quiz") {
      if (!this.quizzes.has(loId)) {
        this.quizzes.set(loId, lo);
      }
    }
    return lo ?? course;
  },

  /**
   * Refreshes all cached labs and notes, forcing markdown to HTML reconversion
   */
  refreshAllLabs() {
    for (const liveLab of this.labs.values()) {
      markdownService.convertLabToHtml(liveLab.course, liveLab.lab, true);
      liveLab.convertMdToHtml();
      liveLab.refreshStep();
    }
    for (const note of this.notes.values()) {
      markdownService.convertNoteToHtml(currentCourse.value!, note, true);
    }
    for (const liveNotebook of this.notebooks.values()) {
      markdownService.convertNotebookToHtml(currentCourse.value!, liveNotebook.notebook, true);
      liveNotebook.refreshNav();
    }
  }
};
