import type { Course, IconType } from "$lib/services/models/lo-types";
import type { CourseVisit } from "../types.svelte";
import { supabase } from "./supabase-client";

export async function updateCourseList(course: Course): Promise<void> {
  if (!isValidCourseName(course.courseId)) return;
  const { data, error } = await supabase
    .from("tutors-connect-courses")
    .select("visit_count")
    .eq("course_id", course.courseId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching row:", error);
    return;
  }

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

function getCourseRecord(course: Course) {
  const courseVisit: CourseVisit = {
    id: course.courseId,
    title: course.title,
    lastVisit: new Date(),
    credits: course.properties.credits,
    private: course.isPrivate
  };
  if (course.properties.icon) {
    courseVisit.icon = course.properties.icon as unknown as IconType;
  } else {
    courseVisit.img = course.img;
  }
  return courseVisit;
}

function isValidCourseName(course: string) {
  const invalidPatterns = /^(main--|master--|deploy-preview--)|-{2}/;
  return !invalidPatterns.test(course);
}
