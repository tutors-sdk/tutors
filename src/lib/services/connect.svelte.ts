/**
 * Authentication and user connection management service.
 * Handles user authentication, course access, analytics tracking, and presence management.
 * Supports both authenticated and anonymous modes.
 */

import { signOut } from "@auth/sveltekit/client";
import { signIn } from "@auth/sveltekit/client";
import { rune } from "./utils/runes.svelte";
import { browser } from "$app/environment";
import type { CourseVisit, TutorsConnectService, TutorsId } from "./types.svelte";
import { goto } from "$app/navigation";
import type { Course } from "./models/lo-types";
import { localStorageProfile } from "./profiles/localStorageProfile";
import { supabaseProfile } from "./profiles/supabaseProfile.svelte";
import { currentCourse, currentLo } from "$lib/runes";
import { analyticsService } from "./analytics.svelte";
import { presenceService } from "./presence.svelte";
import { PUBLIC_ANON_MODE } from "$env/static/public";
import { updateCourseList } from "./profiles/allCourseAccess";

/** Global anonymous mode flag, controlled by environment variable */
let anonMode = false;

if (PUBLIC_ANON_MODE === "TRUE") {
  anonMode = true;
}

export const tutorsConnectService: TutorsConnectService = {
  /** Current user's Tutors identity */
  tutorsId: rune<TutorsId | null>(null),
  /** Active user profile implementation */
  profile: localStorageProfile,
  /** Timer ID for analytics updates */
  intervalId: null,
  /** Local anonymous mode flag */
  anonMode: false,

  /**
   * Initiates GitHub OAuth authentication flow
   * @param redirectStr - URL to redirect to after successful authentication
   * @returns Promise from auth provider
   */
  async connect(redirectStr: string) {
    return await signIn("github", { callbackUrl: redirectStr });
  },

  /**
   * Re-establishes user session and connections
   * Switches to Supabase profile and handles course redirects
   * @param user - User identity to reconnect
   */
  reconnect(user: TutorsId) {
    if (anonMode) return;
    presenceService.connectToAllCourseAccess();
    if (user) {
      this.tutorsId.value = user;
      this.profile = supabaseProfile;
      if (browser) {
        if (!localStorage.share) {
          localStorage.share = true;
        }
        this.tutorsId.value.share = localStorage.share;
        if (localStorage.loginCourse) {
          const courseId = localStorage.loginCourse;
          localStorage.removeItem("loginCourse");
          goto(`/course/${courseId}`);
        }
      }
    }
  },

  /**
   * Terminates user session
   * @param redirectStr - URL to redirect to after logout
   */
  disconnect(redirectStr: string) {
    signOut({ callbackUrl: redirectStr });
  },

  /**
   * Toggles user's content sharing preference
   * Updates both local storage and current session
   */
  toggleShare() {
    if (this.tutorsId.value && browser) {
      if (this.tutorsId.value.share === "true") {
        localStorage.share = this.tutorsId.value.share = "false";
      } else {
        localStorage.share = this.tutorsId.value.share = "true";
      }
    }
  },

  /**
   * Records a course visit and manages associated services
   * Handles auth redirects for protected courses
   * @param course - Course being visited
   */
  courseVisit(course: Course) {
    if (anonMode) return;
    updateCourseList(course);
    this.profile.logCourseVisit(course);
    presenceService.startPresenceListener(course.courseId);
    if (course.authLevel! > 0 && !this.tutorsId.value?.login) {
      localStorage.loginCourse = course.courseId;
      goto(`/auth`);
    }
  },

  /**
   * Adds course to user's favorites
   * @param courseId - Course to favorite
   */
  async favouriteCourse(courseId: string) {
    await this.profile.favouriteCourse(courseId);
  },

  /**
   * Removes course from user's favorites
   * @param courseId - Course to unfavorite
   */
  async unfavouriteCourse(courseId: string) {
    await this.profile.unfavouriteCourse(courseId);
  },

  /**
   * Deletes a course visit record
   * @param courseId - Course visit to delete
   */
  async deleteCourseVisit(courseId: string) {
    await this.profile.deleteCourseVisit(courseId);
  },

  /**
   * Retrieves user's course visit history
   * @returns Promise resolving to array of course visits
   */
  getCourseVisits(): Promise<CourseVisit[]> {
    return this.profile.getCourseVisits();
  },

  /**
   * Records a learning event and broadcasts if sharing enabled
   * @param params - Event parameters to record
   */
  learningEvent(params: Record<string, string>): void {
    if (anonMode) return;
    if (currentCourse.value && currentLo.value && this.tutorsId.value) {
      analyticsService.learningEvent(currentCourse.value, params, currentLo.value, this.tutorsId.value);
      if (this.tutorsId.value.share === "true" && !currentCourse.value.isPrivate) {
        presenceService.sendLoEvent(currentCourse.value, currentLo.value, this.tutorsId.value);
      }
    }
  },

  /**
   * Starts periodic analytics update timer
   * Updates page counts every 30 seconds when page is visible
   */
  startTimer() {
    if (anonMode) return;
    this.intervalId = setInterval(() => {
      if (!document.hidden && currentCourse.value && currentLo.value && this.tutorsId.value) {
        analyticsService.updatePageCount(currentCourse.value, currentLo.value, this.tutorsId.value);
      }
    }, 30 * 1000);
  },

  /**
   * Stops analytics update timer
   */
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};
