import { TutorsTime, type LearningRecord } from "@tutors/tutors-time-lib";
import { currentCourse } from "$lib/runes.svelte";
import { courseService } from "$lib/services/course";
import type { LoEvent } from "$lib/services/community/index.js";
import type { Course } from "@tutors/tutors-model-lib";

/** TutorsTime / Supabase runs in the browser (`hooks.client`); keep this route client-only. */
export const ssr = false;

async function fetchAllLearningRecords(courseId: string): Promise<LearningRecord[]> {
  const id = courseId?.trim();
  if (!id) {
    throw new Error("Course ID is required");
  }
  const courseTime = await TutorsTime.loadCourseTime(id, null, null);
  return [...courseTime.learningRecords];
}

function localYyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function recordLocalYmd(dateLastAccessed: string | null): string | null {
  if (!dateLastAccessed?.trim()) return null;
  try {
    const parsed = new Date(dateLastAccessed.trim());
    if (!Number.isFinite(parsed.getTime())) return null;
    return localYyyyMmDd(parsed);
  } catch {
    return null;
  }
}

function learningRecordToLoEvent(course: Course, record: LearningRecord, courseid: any, title: string): LoEvent {
  const lo = course.loIndex.get(record?.lo_id!);
  return {
    courseId: course.courseId,
    courseUrl: course.courseUrl,
    courseTitle: course.title,
    loRoute: lo?.route!,
    title: lo?.title!,
    img: lo?.img,
    icon: lo?.icon,
    type: record?.type!,
    isPrivate: false,
  };
}


function recordAccessInstantMs(dateLastAccessed: string | null): number {
  if (!dateLastAccessed?.trim()) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(dateLastAccessed.trim());
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
}

function filterLearningRecordsByDate(learningRecords: LearningRecord[], date: Date): LearningRecord[] {
  const target = localYyyyMmDd(date);
  return learningRecords.filter((r) => recordLocalYmd(r.date_last_accessed) === target);
}

/** One row per `student_id`: the most recent by `date_last_accessed` (date + time). */
function getLatestLearningRecordForEachStudent(
  learningRecords: LearningRecord[],
  _course: Course
): LearningRecord[] {
  const sorted = [...learningRecords].sort((a, b) => {
    const tb = recordAccessInstantMs(b.date_last_accessed);
    const ta = recordAccessInstantMs(a.date_last_accessed);
    if (tb !== ta) return tb - ta;
    return (b.lo_id ?? "").localeCompare(a.lo_id ?? "");
  });
  const seen = new Set<string>();
  const out: LearningRecord[] = [];
  for (const r of sorted) {
    const sid = r.student_id?.trim() ?? "";
    if (!sid) continue;
    if (seen.has(sid)) continue;
    seen.add(sid);
    out.push(r);
  }
  return out;
}

export const load = async ({ params, fetch }) => {
  const courseid = params.courseid;

  const course = await courseService.readCourse(courseid, fetch);
  const learningRecords = await fetchAllLearningRecords(courseid);
  const todayLearningRecords = filterLearningRecordsByDate(learningRecords, new Date());
  const todayLatestRecords = getLatestLearningRecordForEachStudent(todayLearningRecords, course);
  let todayLoEvents: LoEvent[] = [];
  for (const record of todayLatestRecords) {
    const loEvent = learningRecordToLoEvent(course, record, courseid, course.title);
    todayLoEvents.push(loEvent);
  }
  currentCourse.value = course;

  return {
    courseid,
    course,
    learningRecords: todayLearningRecords,
  };
};

