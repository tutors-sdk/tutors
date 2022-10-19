import axios from "axios";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import { deleteNode } from "./filrebase-utils";

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
    await deleteNode(deleteList[i]);
  }
}

export async function pruneInvalid(courseList: string[]) {
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i];
    try {
      const url = `https://${course}.netlify.app/tutors.json`;
      await axios.get(url);
    } catch (e) {
      if (course !== "all-course-access") {
        console.log(`Pruning ${course} as invalid`);
        await deleteNode(course);
      }
    }
  }
}

export async function readAllCourseIds(keys: any): Promise<string[]> {
  const courseList = [];

  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    const url = `${keys.databaseURL}/.json?auth=${token}&shallow=true`;
    const response = await axios.get(url);
    const list = await response.data;
    for (const [key, value] of Object.entries(list)) {
      if (value) courseList.push(key);
    }
  }
  return courseList;
}

export async function readAllUsageData(keys: any, courseIds: string[]): Promise<any[]> {
  const courseUsage: any = {};
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, keys.tutorsStoreId, keys.tutorsStoreSecret);
  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    for (let i = 0; i < courseIds.length; i++) {
      const url = `${keys.databaseURL}/${courseIds[i]}/usage.json?auth=${token}`;
      try {
        const response = await axios.get(url);
        const usage = await response.data;
        courseUsage[`${courseIds[i]}`] = usage;
      } catch (error) {
        console.log(error);
      }
    }
  }
  return courseUsage;
}

export async function fetchAllCourseAccess() {
  try {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, "all-course-access"));
    const courseList: any[] = [];
    if (snapshot.exists()) {
      const courseObjs: any = snapshot.val();
      for (const [key, value] of Object.entries(courseObjs)) {
        const course: any = value;
        course.courseId = key;
        courseList.push(course);
      }
    }
    return courseList;
  } catch (error) {
    console.log("TutorStore Error");
  }
}
