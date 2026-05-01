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
import { COURSE_SENTIMENT_IDS } from "$lib/services/connect/types";
import type { TutorsConnectLatestRow } from "../types.svelte";

export let supabase: SupabaseClient;

if (PUBLIC_ANON_MODE !== "TRUE") {
  supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}


export function localYyyyMmDd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function instantLocalYmd(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  try {
    const d = new Date(iso.trim());
    if (!Number.isFinite(d.getTime())) return null;
    return localYyyyMmDd(d);
  } catch {
    return null;
  }
}

/**
 * Upsert latest Lo snapshot for (course, student) into tutors-connect-latest.
 * Fire-and-forget from presence; does not throw.
 */
export async function upsertTutorsConnectLatestLo(loRecord: object): Promise<void> {
  if (PUBLIC_ANON_MODE === "TRUE" || typeof supabase === "undefined") return;

  const rec = loRecord as { courseId?: string; user?: { id?: string } };
  const courseId = rec.courseId?.trim();
  const studentId = rec.user?.id?.trim();
  if (!courseId || !studentId) return;

  const { error } = await supabase.from("tutors-connect-latest").upsert(
    {
      course_id: courseId,
      student_id: studentId,
      payload: loRecord,
      received_at: new Date().toISOString(),
    },
    { onConflict: "course_id,student_id" }
  );

  if (error) {
    console.error("upsertTutorsConnectLatestLo failed:", error);
  }
}



/**
 * All stored Lo snapshots for a course (one row per student, already “latest” by key).
 * Sorted by `received_at` descending (most recently updated first).
 */
export async function getTutorsConnectLatestLosByCourseId(
  courseId: string
): Promise<TutorsConnectLatestRow[]> {
  if (PUBLIC_ANON_MODE === "TRUE" || typeof supabase === "undefined") return [];

  const id = courseId?.trim();
  if (!id) return [];

  const { data, error } = await supabase
    .from("tutors-connect-latest")
    .select("course_id, student_id, payload, received_at")
    .eq("course_id", id)
    .order("received_at", { ascending: false });

  if (error) {
    console.error("getTutorsConnectLatestLosByCourseId failed:", error);
    return [];
  }

  return (data ?? []) as TutorsConnectLatestRow[];
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
    let fullName = student.name;
    
    // If name is null or empty, fetch from GitHub API
    if (!fullName && student.login) {
      try {
        const response = await fetch(`https://api.github.com/users/${student.login}`);
        if (response.ok) {
          const githubUser = await response.json();
          fullName = githubUser.name || student.login;
        } else {
          // Fallback to login if API call fails
          fullName = student.login;
        }
      } catch (fetchError) {
        console.error("Failed to fetch GitHub user:", fetchError);
        // Fallback to login if API call fails
        fullName = student.login;
      }
    }

    const row: {
      github_id: string;
      avatar_url: string;
      full_name: string;
      email: string;
      date_last_accessed: string;
      sentiment: string;
      online_status?: string;
    } = {
      github_id: student.login,
      avatar_url: student.image,
      full_name: fullName,
      email: student.email,
      date_last_accessed: new Date().toISOString(),
      sentiment: student.sentiment
    };
    if (student.share === "true") {
      row.online_status = "online";
    } else if (student.share === "false") {
      row.online_status = "offline";
    }

    const { error } = await supabase.from("tutors-connect-users").upsert(row);

    if (error) {
      console.error("Upsert failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("An error occurred in addOrUpdateUserProfile:", error);
    throw error;
  }
}

function normalizeStoredSentiment(raw: string | null | undefined): string | null {
  if (raw == null || !String(raw).trim()) return null;
  const s = String(raw).trim();
  return (COURSE_SENTIMENT_IDS as readonly string[]).includes(s) ? s : null;
}

/**
 * Fetches sentiment for a row in tutors-connect-users.
 * @param githubId - Student GitHub login (primary key for the row)
 * @returns Stored sentiment if present and valid per {@link COURSE_SENTIMENT_IDS}, otherwise null (includes no row).
 */
export async function getTutorsConnectUserSentiment(githubId: string): Promise<string | null> {
  if (PUBLIC_ANON_MODE === "TRUE" || !githubId) return null;

  const { data, error } = await supabase
    .from("tutors-connect-users")
    .select("sentiment")
    .eq("github_id", githubId)
    .maybeSingle();

  if (error) {
    console.error("getTutorsConnectUserSentiment failed:", error);
    throw error;
  }
  if (!data) return null;
  return normalizeStoredSentiment((data as { sentiment: string | null }).sentiment);
}

/**
 * Updates sentiment (and last-accessed) for a row in tutors-connect-users.
 * @param githubId - Student GitHub login (primary key for the row)
 * @param sentiment - Current mood string
 */
export async function updateTutorsConnectUserSentiment(githubId: string, sentiment: string) {
  if (PUBLIC_ANON_MODE === "TRUE" || !githubId) return;

  const { error } = await supabase
    .from("tutors-connect-users")
    .update({
      sentiment,
      date_last_accessed: new Date().toISOString()
    })
    .eq("github_id", githubId);

  if (error) {
    console.error("updateTutorsConnectUserSentiment failed:", error);
    throw error;
  }
}

/**
 * Fetches online_status for a row in tutors-connect-users (mirrors Share Presence / {@link updateTutorsConnectUserOnlineStatus}).
 * @param githubId - Student GitHub login (primary key for the row)
 * @returns Stored online_status if present, otherwise null (includes no row).
 */
export async function getTutorsConnectUserOnlineStatus(githubId: string): Promise<string | null> {
  if (PUBLIC_ANON_MODE === "TRUE" || !githubId) return null;

  const { data, error } = await supabase
    .from("tutors-connect-users")
    .select("online_status")
    .eq("github_id", githubId)
    .maybeSingle();

  if (error) {
    console.error("getTutorsConnectShare failed:", error);
    throw error;
  }
  if (!data) return null;
  const raw = (data as { online_status: string | null }).online_status;
  if (raw == null || !String(raw).trim()) return null;
  return String(raw).trim();
}

/**
 * Sets online_status on tutors-connect-users (mirrors share: visible / sharing = online).
 */
export async function updateTutorsConnectUserOnlineStatus(githubId: string, onlineStatus: "online" | "offline") {
  if (PUBLIC_ANON_MODE === "TRUE" || !githubId) return;

  const { error } = await supabase
    .from("tutors-connect-users")
    .update({
      online_status: onlineStatus,
      date_last_accessed: new Date().toISOString()
    })
    .eq("github_id", githubId);

  if (error) {
    console.error("updateTutorsConnectUserOnlineStatus failed:", error);
    throw error;
  }
}


