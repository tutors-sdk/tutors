/**
 * @service SupabaseProfile
 * Service for managing user course visit history and preferences in Supabase
 * Implements the ProfileStore interface for server-side persistence
 * Requires authenticated user context from tutorsConnectService
 */

import { supabase } from "$lib/services/community";
import { tutorsId } from "$lib/runes.svelte";

import type { Course, IconType } from "@tutors/tutors-model-lib";
import type { CourseVisit, ProfileStore } from "../types";

export const supabaseProfile: ProfileStore = {
  courseVisits: [] as CourseVisit[],

  /**
   * Loads user's course visit data from Supabase
   * Only retrieves data if user is authenticated
   * @async
   */
  async reload() {
    if (tutorsId.value?.login) {
      const { data: profile } = await supabase.from("tutors-connect-profiles").select("profile").eq("tutorId", tutorsId.value?.login);
      if (profile.length > 0) {
        this.courseVisits = profile[0].profile as unknown as CourseVisit[];
      }
    }
  },

  /**
   * Persists current course visit data to Supabase
   * Only saves if user is authenticated
   * @async
   */
  async save() {
    const id = tutorsId.value?.login;
    if (id) {
      const { error } = await supabase.from("tutors-connect-profiles").upsert({ tutorId: tutorsId.value?.login, profile: this.courseVisits });
      if (error) {
        console.log(error);
      }
    }
  },

  /**
   * Records or updates a course visit in Supabase
   * Creates new visit record if course not previously visited
   * Updates visit count and timestamp if course already exists
   * @async
   * @param course - The course being visited
   */
  async logCourseVisit(course: Course) {
    await this.reload();
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
    await this.save();
  },

  /**
   * Removes a course visit record from Supabase
   * @async
   * @param courseId - Identifier of course to remove
   */
  async deleteCourseVisit(courseId: string) {
    await this.reload();
    this.courseVisits = this.courseVisits.filter((c) => c.id !== courseId);
    await this.save();
  },

  /**
   * Retrieves all course visit records from Supabase
   * @async
   * @returns Promise resolving to array of course visits
   */
  async getCourseVisits(): Promise<CourseVisit[]> {
    await this.reload();
    return this.courseVisits;
  },

  /**
   * Marks a course as favorite in Supabase
   * @async
   * @param courseId - Identifier of course to favorite
   */
  async favouriteCourse(courseId: string) {
    await this.reload();
    const course = this.courseVisits.find((c) => c.id === courseId);
    if (course) {
      course.favourite = true;
    }
    await this.save();
  },

  /**
   * Removes favorite status from a course in Supabase
   * @async
   * @param courseId - Identifier of course to unfavorite
   */
  async unfavouriteCourse(courseId: string) {
    await this.reload();
    const course = this.courseVisits.find((c) => c.id === courseId);
    if (course) {
      course.favourite = false;
    }
    await this.save();
  }
};
