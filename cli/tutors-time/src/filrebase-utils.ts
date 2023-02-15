import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, remove, get, child } from "firebase/database";
import axios from "axios";

export async function initFirebase(keys: any) {
  try {
    if (keys.apiKey !== "XXX") {
      initializeApp(keys);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, keys.tutorsStoreId, keys.tutorsStoreSecret);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteNode(root: string, url: string) {
  const db = getDatabase();
  let key = "";
  if (root) {
    key = `${root}/${url}`;
  } else {
    key = url;
  }
  const obj = ref(db, key);
  await remove(obj);
  console.log(`deleting: ${key}`);
}

export async function readValue(key: string): Promise<string> {
  const dbRef = ref(getDatabase());
  const snapShot = await get(child(dbRef, key));
  return snapShot.val();
}

export async function readVisits(courseId: string) {
  try {
    const visits = await readValue(`${courseId}/visits`);
    return parseInt(visits);
  } catch (error: any) {
    console.log(`TutorStore Error: ${error.message}`);
  }
}

export async function readAllCourseIds(keys: any, root: string): Promise<string[]> {
  const courseList = [];

  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    const url = `${keys.databaseURL}/${root}/.json?auth=${token}&shallow=true`;
    const response = await axios.get(url);
    const list = await response.data;
    for (const [key, value] of Object.entries(list)) {
      if (value) courseList.push(key);
    }
  }
  return courseList;
}

export function isValidCourseName(course: string) {
  let isValid = true;
  if (course.length > 27 && course[24] == "-" && course[25] == "-") {
    isValid = false;
  } else {
    if (course.startsWith("main--") || course.startsWith("master--")) {
      isValid = false;
    }
    if (course.startsWith("deploy-preview")) {
      isValid = false;
    }
  }
  return isValid;
}
