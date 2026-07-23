import { browser } from "$app/environment";
import { rune } from "$lib/runes.svelte";
import { trackableLoTypes, type CourseProgress } from "../types";
import { flattenLos } from "@tutors/tutors-model-lib";
import type { Course, Lo } from "@tutors/tutors-model-lib";

export const progressService = {
  visitedLos: new Map<string, Set<string>>(),
  totalTrackable: new Map<string, number>(),
  version: rune(0),
  loadedCourses: new Set<string>(),

  loadCourseProgress(course: Course): void {
    if (this.loadedCourses.has(course.courseId)) return;
    let visitedRoutes: string[] = [];
    if (browser) {
      const stored = localStorage.getItem(`loProgress_${course.courseId}`);
      if (stored) {
        try {
          visitedRoutes = JSON.parse(stored);
        } catch {}
      }
    }
    this.visitedLos.set(course.courseId, new Set(visitedRoutes));
    const allLos = flattenLos(course.los);
    const total = allLos.filter((lo) => (trackableLoTypes as readonly string[]).includes(lo.type)).length;
    this.totalTrackable.set(course.courseId, total);
    if (browser) {
      localStorage.setItem(`loProgressTotal_${course.courseId}`, String(total));
    }
    this.loadedCourses.add(course.courseId);
    this.version.value++;
  },

  recordVisit(courseId: string, lo: Lo): void {
    if (!(trackableLoTypes as readonly string[]).includes(lo.type)) return;
    if (!lo.route) return;
    let visited = this.visitedLos.get(courseId);
    if (!visited) {
      visited = new Set();
      this.visitedLos.set(courseId, visited);
    }
    if (visited.has(lo.route)) return;
    visited.add(lo.route);
    this.version.value++;
    if (browser) {
      localStorage.setItem(`loProgress_${courseId}`, JSON.stringify([...visited]));
    }
  },

  getProgress(course: Course): CourseProgress {
    void this.version.value;
    const total = this.totalTrackable.get(course.courseId) ?? 0;
    const visited = this.visitedLos.get(course.courseId);
    if (!visited || total === 0) return { visited: 0, total, percentage: 0 };
    const allLos = flattenLos(course.los);
    const trackable = allLos.filter((lo) => (trackableLoTypes as readonly string[]).includes(lo.type));
    const visitedCount = trackable.filter((lo) => visited.has(lo.route)).length;
    return { visited: visitedCount, total, percentage: Math.round((visitedCount / total) * 100) };
  },

  isVisited(courseId: string, loRoute: string): boolean {
    void this.version.value;
    return this.visitedLos.get(courseId)?.has(loRoute) ?? false;
  },

  clearCourseProgress(courseId: string): void {
    this.visitedLos.delete(courseId);
    this.totalTrackable.delete(courseId);
    this.loadedCourses.delete(courseId);
    if (browser) {
      localStorage.removeItem(`loProgress_${courseId}`);
      localStorage.removeItem(`loProgressTotal_${courseId}`);
    }
    this.version.value++;
  }
};
