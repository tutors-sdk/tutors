import { browser } from "$app/environment";
import type { Course, IconType } from "../models/lo-types";
import type { CourseVisit, ProfileStore } from "../types.svelte";

export const localStorageProfile: ProfileStore = {
  courseVisits: [] as CourseVisit[],

  reload(): void {
    if (browser && localStorage.courseVisits) {
      this.courseVisits = JSON.parse(localStorage.courseVisits);
    }
  },
  save(): void {
    if (browser) localStorage.courseVisits = JSON.stringify(this.courseVisits);
  },

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

  deleteCourseVisit(courseId: string) {
    this.reload();
    this.courseVisits = this.courseVisits.filter((c) => c.id !== courseId);
    if (browser) localStorage.courseVisits = JSON.stringify(this.courseVisits);
    this.save();
  },

  getCourseVisits(): Promise<CourseVisit[]> {
    this.reload();
    return this.courseVisits;
  },

  favouriteCourse(courseId: string) {
    this.reload();
    const courseVisit = this.courseVisits.find((c) => c.id === courseId);
    if (courseVisit) {
      courseVisit.favourite = true;
    }
    this.save();
  },

  unfavouriteCourse(courseId: string) {
    this.reload();
    const courseVisit = this.courseVisits.find((c) => c.id === courseId);
    if (courseVisit) {
      courseVisit.favourite = false;
    }
    this.save();
  }
};
