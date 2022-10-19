import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, runTransaction, remove, get, child, set } from "firebase/database";
import axios from "axios";

export interface FirebaseKeys {
  apiKey: string;
  databaseURL: string;
  projectId: string;
  tutorStoreId: string;
  tutorStoreSecret: string;
}

export interface CourseDetails {
  title: string;
  route: string;
  visits: number;
  count: number;
}

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
  } catch (error) {
    console.log("TutorStore Error");
  }
}

export function updateStr(key: string, str: string) {
  try {
    const db = getDatabase();
    const dbRef = ref(db, key);
    void runTransaction(dbRef, function () {
      return str;
    });
  } catch (error) {
    console.log("TutorStore Error");
  }
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

export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

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

export async function fetchAllAtNode(key: string) {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, key));
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

export async function deleteNode(url: string) {
  const db = getDatabase();
  const obj = ref(db, `${url}`);
  await remove(obj);
  console.log(`deleting: ${url}`);
}

export async function writeNode(key: string, data: any) {
  const db = getDatabase();
  await set(ref(db, key), data);
}
