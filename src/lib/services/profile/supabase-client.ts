import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

export const supabase: SupabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function getNumOfLearningRecordsIncrements(
  fieldName: string,
  courseId: string,
  studentId: string,
  loId: string
) {
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

export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

export const updateCalendarDuration = async (id: string, studentId: string, courseId: string) => {
  if (!id || !studentId || !courseId) return;
  await supabase.rpc("increment_calendar", {
    field_name: "timeactive",
    row_id: id,
    student_id_value: studentId,
    course_id_value: courseId
  });
};

export async function getCalendarDuration(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await supabase
    .from("calendar")
    .select("timeactive")
    .eq("id", id)
    .eq("studentid", studentId)
    .eq("courseid", courseId)
    .maybeSingle();
  return data?.timeactive ? data.timeactive + 1 : 1;
}

export async function getCalendarCount(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await supabase
    .from("calendar")
    .select("pageloads")
    .eq("id", id)
    .eq("studentid", studentId)
    .eq("courseid", courseId)
    .maybeSingle();
  return data?.pageloads ? data.pageloads + 1 : 1;
}

export async function getDurationTotal(key: string, table: string, id: string): Promise<number> {
  const { data } = await supabase.from(table).select("duration").eq(key, id).single();
  return data?.duration || 1;
}

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

export async function handleInteractionData(courseId: string, studentId: string, loId: string, lo: Lo) {
  if (!courseId || !studentId || !loId) return;
  await manageStudentCourseLo(courseId, studentId, loId, lo);
}

export async function storeStudentCourseLearningObjectInSupabase(
  course: Course,
  loid: string,
  lo: Lo,
  student: TutorsId
) {
  //   const loTitle = getLoTitle(params)
  //if (userDetails?.user_metadata?.full_name === "Anon") return;
  // await insertOrUpdateCourse(course);
  // await addOrUpdateStudent(userDetails);
  // await addOrUpdateLo(loid, lo, lo.title);
  await handleInteractionData(course.courseId, student.login, loid, lo);
  await insertOrUpdateCalendar(student.login, course.courseId);
}

export async function updateLearningRecordsDuration(courseId: string, studentId: string, loId: string) {
  const numOfDuration = await getNumOfLearningRecordsIncrements("duration", courseId, studentId, loId);
  await supabase
    .from("learning_records")
    .update({ duration: numOfDuration })
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .eq("lo_id", loId);
}

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
