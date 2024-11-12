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
  visits?: number;
};

interface RowData {
  course_id: string;
  last_updated: Date;
  visits: number;
}

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
  },

  async updateCourseList(course: Course): Promise<void> {
    // Get the current row by key
    if (!isValidCourseName(course.courseId)) return;
    const { data, error } = await supabase.from("tutors-connect-courses").select("visit_count").eq("course_id", course.courseId).single();

    if (error && error.code !== "PGRST116") {
      // Handle error if it's not "Row not found"
      console.error("Error fetching row:", error);
      return;
    }

    // Determine new count and current date
    const newVisits = data ? data.visit_count + 1 : 1;
    const now = new Date();

    // Upsert the row with the updated count and date
    const { error: upsertError } = await supabase.from("tutors-connect-courses").upsert(
      {
        course_id: course.courseId,
        visited_at: now,
        visit_count: newVisits,
        course_record: getCourseRecord(course)
      },
      { onConflict: ["course_id"] }
    );

    if (upsertError) {
      console.error("Error upserting row:", upsertError);
    }
  }
};

function getCourseRecord(course: Course) {
  const courseVisit: CourseVisit = {
    id: course.courseId,
    title: course.title,
    lastVisit: new Date(),
    credits: course.properties.credits
  };
  if (course.properties.icon) {
    courseVisit.icon = course.properties.icon as unknown as IconType;
  } else {
    courseVisit.image = course.img;
  }
  return courseVisit;
}

function isValidCourseName(course: string) {
  const invalidPatterns = /^(main--|master--|deploy-preview--)|-{2}/;
  return !invalidPatterns.test(course);
}
