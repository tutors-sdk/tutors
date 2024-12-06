import type { Course, IconType } from "../models/lo-types";
import { tutorsConnectService } from "$lib/services/connect.svelte.js";
import type { CourseVisit, ProfileStore } from "../types.svelte";
import { supabase } from "./supabase-client";

export const supabaseProfile: ProfileStore = {
  courseVisits: [] as CourseVisit[],

  async reload() {
    if (tutorsConnectService.tutorsId.value?.login) {
      const { data: profile } = await supabase
        .from("tutors-connect-profiles")
        .select("profile")
        .eq("tutorId", tutorsConnectService.tutorsId.value?.login);
      if (profile.length > 0) {
        this.courseVisits = profile[0].profile as unknown as CourseVisit[];
      }
    }
  },

  async save() {
    const id = tutorsConnectService.tutorsId.value?.login;
    if (id) {
      const { error } = await supabase
        .from("tutors-connect-profiles")
        .upsert({ tutorId: tutorsConnectService.tutorsId.value?.login, profile: this.courseVisits });
      if (error) {
        console.log(error);
      }
    }
  },

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

  async deleteCourseVisit(courseId: string) {
    await this.reload();
    this.courseVisits = this.courseVisits.filter((c) => c.id !== courseId);
    await this.save();
  },

  async getCourseVisits(): Promise<CourseVisit[]> {
    await this.reload();
    return this.courseVisits;
  },

  async favouriteCourse(courseId: string) {
    await this.reload();
    const course = this.courseVisits.find((c) => c.id === courseId);
    if (course) {
      course.favourite = true;
    }
    await this.save();
  },

  async unfavouriteCourse(courseId: string) {
    await this.reload();
    const course = this.courseVisits.find((c) => c.id === courseId);
    if (course) {
      course.favourite = false;
    }
    await this.save();
  }
};
