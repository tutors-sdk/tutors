/**
 * @service LocalStorageProfile
 * Service for managing user course visit history and preferences in browser local storage
 * Implements the ProfileStore interface for persistent client-side storage
 */

import { browser } from "$app/environment";
import type { Course, IconType } from "$lib/services/base/lo-types";
import type { CourseVisit, ProfileStore } from "../types";

export const localStorageProfile: ProfileStore = {
  courseVisits: [] as CourseVisit[],

  /**
   * Loads course visit data from local storage into memory
   * Only executes in browser environment
   */
  reload(): void {
    if (browser && localStorage.courseVisits) {
      this.courseVisits = JSON.parse(localStorage.courseVisits);
    }
  },
  /**
   * Persists current course visit data to local storage
   * Only executes in browser environment
   */
  save(): void {
    if (browser) localStorage.courseVisits = JSON.stringify(this.courseVisits);
  },

  /**
   * Records or updates a course visit in local storage
   * Creates new visit record if course not previously visited
   * Updates visit count and timestamp if course already exists
   * @param course - The course being visited
   */
  logCourseVisit(course: Course) {
    this.reload();
    const visit = this.courseVisits.find((c) => c.id === course.courseId);
    if (visit) {
      visit.visits++;
      visit.lastVisit = new Date();
    } else {
      const courseVisit: CourseVisit = {
        id: course.courseId,
        title: course.title,
        lastVisit: new Date(),
        credits: course.properties.credits,
        visits: 1
      };
      if (course.properties.icon) {
        courseVisit.icon = course.properties.icon as unknown as IconType;
      } else {
        courseVisit.image = course.img;
      }
      this.courseVisits.unshift(courseVisit);
    }
    this.save();
  },

  /**
   * Removes a course visit record from local storage
   * @param courseId - Identifier of course to remove
   */
  deleteCourseVisit(courseId: string) {
    this.reload();
    this.courseVisits = this.courseVisits.filter((c) => c.id !== courseId);
    if (browser) localStorage.courseVisits = JSON.stringify(this.courseVisits);
    this.save();
  },

  /**
   * Retrieves all course visit records from local storage
   * @returns Promise resolving to array of course visits
   */
  getCourseVisits(): Promise<CourseVisit[]> {
    this.reload();
    return this.courseVisits;
  },

  /**
   * Marks a course as favorite in local storage
   * @param courseId - Identifier of course to favorite
   */
  favouriteCourse(courseId: string) {
    this.reload();
    const courseVisit = this.courseVisits.find((c) => c.id === courseId);
    if (courseVisit) {
      courseVisit.favourite = true;
    }
    this.save();
  },

  /**
   * Removes favorite status from a course in local storage
   * @param courseId - Identifier of course to unfavorite
   */
  unfavouriteCourse(courseId: string) {
    this.reload();
    const courseVisit = this.courseVisits.find((c) => c.id === courseId);
    if (courseVisit) {
      courseVisit.favourite = false;
    }
    this.save();
  }
};
