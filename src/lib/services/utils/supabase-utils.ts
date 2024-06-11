import { db } from "$lib/services/utils/db/client";
import type { Course, LearningRecord, Lo } from "../models/lo-types";
import type { User, Session } from "@supabase/supabase-js";
import { filterByType } from "../models/lo-utils";

export async function getNumOfLearningRecordsIncrements(fieldName: string, courseId: string, studentId: string, loId: string) {
  if (!courseId || !studentId || !loId) return 0;

  const { data: student, error } = await db.rpc('get_count_learning_records', {
    field_name: fieldName,
    course_base: courseId,
    user_name: studentId,
    lo_key: loId
  });

  if (error) {
    console.error('Error fetching student interaction:', error);
    return 0;
  }
  return student ? student[0].increment + 1 : 1;
};

export async function getMedianTimeActivePerDate(courseId: string) {
  if (!courseId) return 0;

  const { data, error } = await db.rpc('get_median_time_active_per_date', {
    course_base: courseId
  });

  if (error) {
    console.error('Error fetching calendar data:', error);
    return 0;
  }
  return data;
};

export async function updateStudentsStatus(key: string, str: string) {
  await db.from('students').update({ online_status: str, }).eq('id', key);
};

export async function readValue(key: string): Promise<any> {
  const { data, error } = await db.from('students').select().eq('id', key);
  return data;
};

export async function getCalendarDataPerStudent(courseId: string, studentId: string): Promise<any> {
  const { data, error } = await db.from('calendar').select().eq('student_id', studentId).eq('course_id', courseId);
  return data;
};

export async function getCalendarDataForAll(courseId: string): Promise<any> {
  const { data, error } = await db.from('calendar').select().eq('courseid', courseId);
  return data;
};

export async function getCalendarDuration(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await db.from('calendar').select('timeactive').eq('id', id).eq('studentid', studentId).eq('courseid', courseId).maybeSingle();
  return data?.timeactive ? data.timeactive + 1 : 1;
};

export async function getCalendarCount(id: string, studentId: string, courseId: string): Promise<number> {
  const { data } = await db.from('calendar').select('pageloads').eq('id', id).eq('studentid', studentId).eq('courseid', courseId).maybeSingle();
  return data?.pageloads ? data.pageloads + 1 : 1;
};

export async function getDurationTotal(key: string, table: string, id: string): Promise<number> {
  const { data } = await db.from(table).select('duration').eq(key, id).single();
  return data?.duration || 1;
};

export async function insertOrUpdateCalendar(studentId: string, courseId: string) {
  const durationPromise = getCalendarDuration(formatDate(new Date()), studentId, courseId);
  const countPromise = getCalendarCount(formatDate(new Date()), studentId, courseId);
  const [timeActive, pageLoads] = await Promise.all([durationPromise, countPromise]);
  await db
    .from('calendar')
    .upsert({
      id: formatDate(new Date()),
      studentid: studentId,
      timeactive: timeActive,
      pageloads: pageLoads,
      courseid: courseId
    }, {
      onConflict: 'id, studentid, courseid'
    });
};

export async function insertOrUpdateCourse(course: Course) {
  const durationPromise = getDurationTotal("course_id", "course", course.courseId);
  const countPromise = updateCount("course_id", "course", course.courseId);
  const [duration, count] = await Promise.all([durationPromise, countPromise]);
  await db
    .from('course')
    .upsert({
      course_id: course.courseId,
      title: course.title,
      duration: duration,
      count: count,
      date_last_accessed: new Date().toISOString(),
      img: course.img,
      icon: course.icon
    }, {
      onConflict: 'course_id'
    });
};

export async function addOrUpdateStudent(userDetails: User) {
  const durationPromise = getDurationTotal("id", "students", userDetails.user_metadata.user_name);
  const countPromise = updateCount("id", "students", userDetails.user_metadata.user_name);
  const [duration, count] = await Promise.all([durationPromise, countPromise]);
  const { data, error } = await db
    .from('students')
    .upsert({
      id: userDetails.user_metadata.user_name,
      avatar: userDetails.user_metadata.avatar_url,
      full_name: userDetails.user_metadata.full_name,
      email: userDetails.user_metadata.email || "",
      duration: duration,
      date_last_accessed: new Date().toISOString(),
      count: count,
    }, {
      onConflict: 'id'
    });

  if (error) throw error;
};

export async function updateLastAccess(key: string, id: string, table: any): Promise<any> {
  const { error: updateError } = await db.from(table).update({ date_last_accessed: new Date().toISOString() }).eq(key, id);
  if (updateError) {
    throw updateError;
  }
};

export async function addOrUpdateLo(loid: string, currentLo: Lo, loTitle: string) {
  if (!loid) return;
  const { error } = await db
    .from('learningobject')
    .upsert({
      id: loid,
      type: currentLo?.type,
      name: loTitle,
      date_last_accessed: new Date().toISOString(),
      parent: currentLo.parentLo ? currentLo.parentLo.route : null,
      child: currentLo.route,
      lo_img: currentLo.img,
      icon: currentLo.icon,
      topic_title: currentLo.parentTopic ? currentLo.parentTopic.title : null,
      lab_title: currentLo.type === 'lab' ? currentLo.title : null,
    }, {
      onConflict: 'id'
    });

  if (error) throw error;
};

export async function updateLearningRecordsDuration(courseId: string, studentId: string, loId: string) {
  const numOfDuration = await getNumOfLearningRecordsIncrements('duration', courseId, studentId, loId);
  //const dateLastAccessed = await getDateLastAccessed(courseId, studentId, loId);

  //if (dateLastAccessed) {
    //const now = new Date();
    //const lastAccessTime = new Date(dateLastAccessed);
    //const minutesSinceLastAccess = (now.getTime() - lastAccessTime.getTime()) / (1000 * 60);

   // if (minutesSinceLastAccess <= 200) {
      await db
        .from('learning_records')
        .update({ 'duration': numOfDuration })
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .eq('lo_id', loId);
    //}
  //}
}

async function getDateLastAccessed(courseId: string, studentId: string, loId: string) {
  const result = await db
    .from('learning_records')
    .select('date_last_accessed')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .eq('lo_id', loId)
    .single();

  return result.data ? result.data.date_last_accessed : null;
}

export async function updateCount(key: string, table: string, id: string) {
  if (!key || !table || !id) return;
  await db.rpc('increment_field', { table_name: table, field_name: 'count', key: key, row_id: id });
};

export async function updateDuration(key: string, table: string, id: string) {
  if (!key || !table || !id) return;
  await db.rpc('increment_field', { table_name: table, field_name: 'duration', key: key, row_id: id });
};

export const updateCalendarCount = async (id: string, studentId: string, courseId: string) => {
  if (!id || !studentId || !courseId) return;
  await db.rpc('increment_calendar', { field_name: 'pageloads', row_id: id, student_id_value: studentId, course_id_value: courseId });
};

export const updateCalendarDuration = async (id: string, studentId: string, courseId: string) => {
  if (!id || !studentId || !courseId) return;
  await db.rpc('increment_calendar', { field_name: 'timeactive', row_id: id, student_id_value: studentId, course_id_value: courseId });
};

export async function storeStudentCourseLearningObjectInSupabase(course: Course, loid: string, lo: Lo, userDetails: User) {
  //   const loTitle = getLoTitle(params)
  if (userDetails?.user_metadata.full_name === "Anon") return;
  // await insertOrUpdateCourse(course);
  // await addOrUpdateStudent(userDetails);
  // await addOrUpdateLo(loid, lo, lo.title);
  await handleInteractionData(course.courseId, userDetails.user_metadata.user_name, loid, lo);
  await insertOrUpdateCalendar(userDetails.user_metadata.user_name, course.courseId);
};

export async function handleInteractionData(courseId: string, studentId: string, loId: string, lo: Lo) {
  if (!courseId || !studentId || !loId) return;
  await manageStudentCourseLo(courseId, studentId, loId, lo);
};

export function studentInteractionsUpdates(callback: (arg: any) => void) {
  db
    .channel('schema-db-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'calendar'
    }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
};

export async function manageStudentCourseLo(courseId: string, studentId: string, loId: string, lo: Lo) {
  const durationPromise = getNumOfLearningRecordsIncrements('duration', courseId, studentId, loId);
  const countPromise = getNumOfLearningRecordsIncrements('count', courseId, studentId, loId);
  const [duration, count] = await Promise.all([durationPromise, countPromise]);
  const { error } = await db
    .from('learning_records')
    .upsert({
      course_id: courseId,
      student_id: studentId,
      lo_id: loId,
      date_last_accessed: new Date().toISOString(),
      duration: duration,
      count: count,
      type: lo.type
    }, {
      onConflict: 'student_id, course_id, lo_id',
      ignoreDuplicates: false
    });
  if (error) throw error;
};

export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

export function getCompositeValues(los: Lo[]) {
  const units = filterByType(los, "unit");
  const sides = filterByType(los, 'side');
  const topics = filterByType(los, 'topic');

  return [...units, ...sides, ...topics];
};

export function getSimpleTypesValues(los: Lo[]) {
  const notes = filterByType(los, "note");
  const archives = filterByType(los, 'archive');
  const webs = filterByType(los, 'web');
  const githubs = filterByType(los, "github");
  const panelnotes = filterByType(los, 'panelnote');
  const paneltalks = filterByType(los, 'paneltalk');
  const panelVideos = filterByType(los, "panelvideo");
  const talks = filterByType(los, 'talk');
  const books = filterByType(los, 'book');
  const labs = filterByType(los, "lab");
  const steps = filterByType(los, "step");

  return [...notes, ...archives, ...webs, ...githubs, ...panelnotes, ...paneltalks, ...panelVideos, ...talks, ...books, ...labs, ...steps];
};

export async function getUser(username: string) {
  return fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(response => {
      return response.name;
    })
};