import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { FirebaseKeys } from "../types/store-types";
import { child, get, getDatabase, ref, runTransaction, remove, set } from "firebase/database";

export function getNode(lotype: string, url: string, path: string): string {
  let node = "";
  if (lotype !== "course") {
    node = sanatisePath(url, path);
  }
  return node;
}

export function updateLastAccess(root: string, key: string, title: string) {
  updateStr(`${root}/${key}/last`, new Date().toLocaleString());
  updateStr(`${root}/${key}/title`, title);
}

export function updateVisits(root: string, key: string) {
  updateCountValue(`${root}/${key}/visits`);
}

export function updateCount(root: string, key: string) {
  updateCountValue(`${root}/${key}/count`);
}

export function updateCountValue(key: string) {
  try {
    const db = getDatabase();
    const dbRef = ref(db, key);
    void runTransaction(dbRef, function (count: number) {
      return (count || 0) + 1;
    });
  } catch (error: any) {
    console.log(`TutorStore Error: ${error.message}`);
  }
}

export function updateStr(key: string, str: string) {
  try {
    const db = getDatabase();
    const dbRef = ref(db, key);
    void runTransaction(dbRef, function () {
      return str;
    });
  } catch (error: any) {
    console.log(`TutorStore Error: ${error.message}`);
  }
}
export function writeObj(key: string, obj: any) {
  try {
    const db = getDatabase();
    const dbRef = ref(db, key);
    void set(dbRef, obj);
  } catch (error: any) {
    console.log(`TutorStore Error: ${error.message}`);
  }
}

export async function deleteObj(root: string, url: string) {
  const db = getDatabase();
  let key = "";
  if (root) {
    key = `${root}/${url}`;
  } else {
    key = url;
  }
  const obj = ref(db, key);
  await remove(obj);
}

export function sanatisePath(url: string, path: string) {
  let node = path.replace(url, "");
  node = node.substr(node.indexOf("//") + 2, node.length);
  // eslint-disable-next-line no-useless-escape
  node = node.replace(/[`#$.\[\]]/gi, "*");
  return node;
}

export function updateCalendar(root: string) {
  const dateObj = new Date();
  const date = formatDate(dateObj);
  updateCountValue(`${root}/calendar/${date}`);
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

export async function deleteCourseFromList(url: string) {
  try {
    const db = getDatabase();
    const obj = ref(db, `all-course-access/${url}`);
    await remove(obj);
    console.log(`deleting: ${url} as invalid`);
  } catch (error: any) {
    console.log(`TutorStore Error: ${error.message}`);
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

export function initFirebase(keys: FirebaseKeys) {
  if (keys.apiKey !== "XXX") {
    initializeApp(keys);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, keys.tutorStoreId, keys.tutorStoreSecret)
      .then(() => {
        console.log("Connected to TutorStore");
      })
      .catch((error: any) => {
        console.log(`TutorStore Error: ${error.message}`);
      });
  }
}

export async function readAllCourseIds(keys: FirebaseKeys): Promise<string[]> {
  const courseList = [];
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, keys.tutorStoreId, keys.tutorStoreSecret);
  const user = getAuth().currentUser;
  const token = await user.getIdToken(true);
  const url = `${keys.databaseURL}/.json?auth=${token}&shallow=true`;
  const response = await fetch(url);
  const list = await response.json();
  for (const [key, value] of Object.entries(list)) {
    if (value) courseList.push(key);
  }
  return courseList;
}

export async function readAllCourseAccessIds(keys: FirebaseKeys): Promise<any[]> {
  const courseList = [];
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, keys.tutorStoreId, keys.tutorStoreSecret);
  const user = getAuth().currentUser;
  const token = await user.getIdToken(true);
  const url = `${keys.databaseURL}/all-course-access.json?auth=${token}`;
  const response = await fetch(url);
  const list = await response.json();
  for (const [key, value] of Object.entries(list)) {
    if (value) courseList.push(key);
  }
  return courseList;
}
