import type { Course, IconType } from "$lib/services/models/lo-types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

export type CourseVisit = {
  id: string;
  title: string;
  image?: string;
  icon?: IconType;
  lastVisit: Date;
  credits: string;
  visits: number;
};

export interface ProfileStore {
  courseVisits: CourseVisit[];

  reload(): void;
  save(): void;
  logCourseVisit(course: Course): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
}

export const supabase: SupabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const supabaseProfile = {
  courseVisits: [] as CourseVisit[],

  async reload(studentId: string) {
    const { data: profile } = await supabase.from("tutors-connect-profiles").select("profile").eq("tutorId", studentId);
    if (profile.length > 0) {
      this.courseVisits = profile[0].profile as unknown as CourseVisit[];
    }
  },

  async save(studentId: string) {
    const { error } = await supabase.from("tutors-connect-profiles").upsert({ tutorId: studentId, profile: this.courseVisits });
    if (error) {
      console.log(error);
    }
  },

  async logCourseVisit(course: Course, studentId: string) {
    await this.reload(studentId);
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
    await this.save(studentId);
  }
};
