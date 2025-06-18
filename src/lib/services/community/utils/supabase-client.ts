/**
 * @service SupabaseClient
 * Service for managing Supabase database connections and operations
 * Handles learning analytics, user interactions, and calendar data
 * Provides low-level database operations for the Tutors platform
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_ANON_MODE } from "$env/static/public";
import type { Course, Lo } from "@tutors/tutors-model-lib";
import type { TutorsId } from "$lib/services/connect";

export let supabase: SupabaseClient;

if (PUBLIC_ANON_MODE !== "TRUE") {
  supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Retrieves the number of learning record increments for a specific field
 * @async
 * @param fieldName - Name of the field to count increments for
 * @param courseId - Identifier of the course
 * @param studentId - Identifier of the student
 * @param loId - Identifier of the learning object
 * @returns Promise resolving to the number of increments
 */
export async function getNumOfLearningRecordsIncrements(fieldName: string, courseId: string, studentId: string, loId: string) {
  if (!courseId || !studentId || !loId) return 0;

  const { data: student, error } = await supabase.rpc("get_count_learning_records", {
    field_name: fieldName,
    course_base: courseId,
    user_name: studentId,
    lo_key: loId
  });

  if (error) {
    console.error("Error fetching student interaction:", error);
    return 0;
  }
  return student ? student[0].increment + 1 : 1;
}

/**
 * Manages student interaction data with a course learning object
 * Updates both duration and count metrics
 * @async
 * @param courseId - Identifier of the course
 * @param studentId - Identifier of the student
 * @param loId - Identifier of the learning object
 * @param lo - Learning object data
 */
export async function manageStudentCourseLo(courseId: string, studentId: string, loId: string, lo: Lo) {
  const durationPromise = getNumOfLearningRecordsIncrements("duration", courseId, studentId, loId);
  const countPromise = getNumOfLearningRecordsIncrements("count", courseId, studentId, loId);
  const [duration, count] = await Promise.all([durationPromise, countPromise]);
  const { error } = await supabase.from("learning_records").upsert(
    {
      course_id: courseId,
      student_id: studentId,
      lo_id: loId,
      date_last_accessed: new Date().toISOString(),
      duration: duration,
      count: count,
      type: lo.type
    },
    {
      onConflict: "student_id, course_id, lo_id",
      ignoreDuplicates: false
    }
  );
  if (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Formats a date into a standardized string format
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

/**
 * Updates the duration of a calendar entry
 * @async
 * @param id - Calendar entry identifier
 * @param studentId - Identifier of the student
 * @param courseId - Identifier of the course
 */
export const updateCalendarDuration = async (id: string, studentId: string, courseId: string) => {
  if (!id || !studentId || !courseId) return;
  await supabase.rpc("increment_calendar", {
    field_name: "timeactive",
    row_id: id,
    student_id_value: studentId,
    course_id_value: courseId
  });
};

/**
 * Retrieves the duration from a calendar entry
 * @async
 * @param id - Calendar entry identifier
 * @param studentId - Identifier of the student
 * @param courseId - Identifier of the course
 * @returns Promise resolving to the duration value
 */
export async function getCalendarDuration(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await supabase.from("calendar").select("timeactive").eq("id", id).eq("studentid", studentId).eq("courseid", courseId).maybeSingle();
  return data?.timeactive ? data.timeactive + 1 : 1;
}

/**
 * Retrieves the count from a calendar entry
 * @async
 * @param id - Calendar entry identifier
 * @param studentId - Identifier of the student
 * @param courseId - Identifier of the course
 * @returns Promise resolving to the count value
 */
export async function getCalendarCount(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await supabase.from("calendar").select("pageloads").eq("id", id).eq("studentid", studentId).eq("courseid", courseId).maybeSingle();
  return data?.pageloads ? data.pageloads + 1 : 1;
}

/**
 * Calculates the total duration for a specific metric
 * @async
 * @param key - Metric key to total
 * @param table - Database table name
 * @param id - Identifier for the record
 * @returns Promise resolving to the total duration
 */
export async function getDurationTotal(key: string, table: string, id: string): Promise<number> {
  const { data } = await supabase.from(table).select("duration").eq(key, id).single();
  return data?.duration || 1;
}

/**
 * Creates or updates a calendar entry for a student's course interaction
 * @async
 * @param studentId - Identifier of the student
 * @param courseId - Identifier of the course
 */
export async function insertOrUpdateCalendar(studentId: string, courseId: string) {
  if (!studentId || !courseId) return;
  const durationPromise = getCalendarDuration(formatDate(new Date()), studentId, courseId);
  const countPromise = getCalendarCount(formatDate(new Date()), studentId, courseId);
  const [timeActive, pageLoads] = await Promise.all([durationPromise, countPromise]);
  await supabase.from("calendar").upsert(
    {
      id: formatDate(new Date()),
      studentid: studentId,
      timeactive: timeActive,
      pageloads: pageLoads,
      courseid: courseId
    },
    {
      onConflict: "id, studentid, courseid"
    }
  );
}

/**
 * Processes student interaction data with learning objects
 * @async
 * @param courseId - Identifier of the course
 * @param studentId - Identifier of the student
 * @param loId - Identifier of the learning object
 * @param lo - Learning object data
 */
export async function handleInteractionData(courseId: string, studentId: string, loId: string, lo: Lo) {
  if (!courseId || !studentId || !loId) return;
  await manageStudentCourseLo(courseId, studentId, loId, lo);
}

/**
 * Stores student's interaction with a course learning object in Supabase
 * @async
 * @param course - Course data
 * @param loid - Learning object identifier
 * @param lo - Learning object data
 * @param student - Student data
 */
export async function storeStudentCourseLearningObjectInSupabase(course: Course, loid: string, lo: Lo, student: TutorsId) {
  //   const loTitle = getLoTitle(params)
  //if (userDetails?.user_metadata?.full_name === "Anon") return;
  // await insertOrUpdateCourse(course);
  // await addOrUpdateStudent(userDetails);
  // await addOrUpdateLo(loid, lo, lo.title);
  await handleInteractionData(course.courseId, student.login, loid, lo);
  await insertOrUpdateCalendar(student.login, course.courseId);
}

/**
 * Updates the duration metric for learning records
 * @async
 * @param courseId - Identifier of the course
 * @param studentId - Identifier of the student
 * @param loId - Identifier of the learning object
 */
export async function updateLearningRecordsDuration(courseId: string, studentId: string, loId: string) {
  const numOfDuration = await getNumOfLearningRecordsIncrements("duration", courseId, studentId, loId);
  await supabase.from("learning_records").update({ duration: numOfDuration }).eq("student_id", studentId).eq("course_id", courseId).eq("lo_id", loId);
}

/**
 * Creates or updates a student record in the database
 * @async
 * @param student - Student data to store
 */
export async function addOrUpdateStudent(student: TutorsId) {
  if (!student) return;

  try {
    const { error } = await supabase.from("users").upsert(
      {
        github_id: student.login,
        avatar_url: student.image,
        full_name: student.name,
        email: student.email,
        date_last_accessed: new Date().toISOString()
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Upsert failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("An error occurred in addOrUpdateUserProfile:", error);
    throw error;
  }
}
