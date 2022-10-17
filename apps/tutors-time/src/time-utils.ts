import { child, remove, get, getDatabase, ref } from "firebase/database";
import axios from "axios";

export async function fetchAllCourseList() {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, "all-course-access"));
  const courseList: any[] = [];
  if (snapshot.exists()) {
    const courseObjs: any = snapshot.val();
    for (const [key, value] of Object.entries(courseObjs)) {
      const course: any = value;
      course.url = key;
      courseList.push(course);
    }
  }
  return courseList;
}

export async function fetchAll(): Promise<string[]> {
  const dbRef = ref(getDatabase());
  const snapshot = await get(dbRef);
  const courseList = [];
  if (snapshot.exists()) {
    const courseObjs: any = snapshot.val();
    for (const [key, value] of Object.entries(courseObjs)) {
      courseList.push(key);
    }
  }
  return courseList;
}

export async function deleteCourseFromList(url: string) {
  const db = getDatabase();
  const obj = ref(db, `${url}`);
  await remove(obj);
  console.log(`deleting: ${url} as invalid`);
}

export function filterPreviews(courseList: string[]) {
  const filtered: string[] = [];
  courseList.forEach((course) => {
    if (course[24] == "-" && course[25] == "-") {
      filtered.push(course);
    } else {
      if (course.startsWith("main--") || course.startsWith("master--")) {
        filtered.push(course);
      }
      if (course.startsWith("deploy-preview")) {
        filtered.push(course);
      }
    }
  });
  return filtered;
}

export async function prunePreviews(courseList: string[]) {
  const deleteList = filterPreviews(courseList);
  for (let i = 0; i < deleteList.length; i++) {
    console.log(deleteList[i]);
    await deleteCourseFromList(deleteList[i]);
  }
}

export async function pruneInvalid(courseList: string[]) {
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i];
    try {
      const url = `https://${course}.netlify.app/tutors.json`;
      const response = await axios.get(url);
      console.log(course);
    } catch (e) {
      if (course !== "all-course-access") {
        console.log(`Deleteing ${course}`);
        await deleteCourseFromList(course);
      }
    }
  }
}
