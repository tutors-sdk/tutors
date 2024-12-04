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

let anonMode = false;

if (PUBLIC_ANON_MODE === "TRUE") {
  anonMode = true;
}

export const tutorsConnectService: TutorsConnectService = {
  tutorsId: rune<TutorsId | null>(null),
  profile: localStorageProfile,
  intervalId: null,
  anonMode: false,

  async connect(redirectStr: string) {
    return await signIn("github", { callbackUrl: redirectStr });
  },

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

  disconnect(redirectStr: string) {
    signOut({ callbackUrl: redirectStr });
  },

  toggleShare() {
    if (this.tutorsId.value && browser) {
      if (this.tutorsId.value.share === "true") {
        localStorage.share = this.tutorsId.value.share = "false";
      } else {
        localStorage.share = this.tutorsId.value.share = "true";
      }
    }
  },

  courseVisit(course: Course) {
    if (anonMode) return;
    updateCourseList(course);
    this.profile.logCourseVisit(course);
    presenceService.startPresenceListener(course.courseId);
    if (course.authLevel! > 0 && !this.tutorsId.value?.login) {
      localStorage.loginCourse = course.courseId;
      // goto(`/auth`);
    }
  },

  deleteCourseVisit(courseId: string) {
    this.profile.deleteCourseVisit(courseId);
  },

  getCourseVisits(): Promise<CourseVisit[]> {
    return this.profile.getCourseVisits();
  },

  learningEvent(params: Record<string, string>): void {
    if (anonMode) return;
    if (currentCourse.value && currentLo.value && this.tutorsId.value) {
      analyticsService.learningEvent(currentCourse.value, params, currentLo.value, this.tutorsId.value);
      if (this.tutorsId.value.share === "true" && !currentCourse.value.isPrivate) {
        presenceService.sendLoEvent(currentCourse.value, currentLo.value, this.tutorsId.value);
      }
    }
  },

  startTimer() {
    if (anonMode) return;
    this.intervalId = setInterval(() => {
      if (!document.hidden && currentCourse.value && currentLo.value && this.tutorsId.value) {
        analyticsService.updatePageCount(currentCourse.value, currentLo.value, this.tutorsId.value);
      }
    }, 30 * 1000);
  },

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};
