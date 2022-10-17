import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, runTransaction, remove } from "firebase/database";
import axios from "axios";

export interface FirebaseKeys {
  apiKey: string;
  databaseURL: string;
  projectId: string;
  tutorStoreId: string;
  tutorStoreSecret: string;
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

export async function deleteCourseFromList(url: string) {
  try {
    const db = getDatabase();
    const obj = ref(db, `all-course-access/${url}`);
    await remove(obj);
    console.log(`deleting: ${url} as invalid`);
  } catch (error) {
    console.log("TutorStore Error");
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

export async function initFirebase(keys: any) {
  try {
    if (keys.apiKey !== "XXX") {
      initializeApp(keys);
      const auth = getAuth();
      const email = keys.tutorsStoreId;
      const secret = keys.tutorsStoreSecret;
      const user = await signInWithEmailAndPassword(auth, email, secret);
      console.log(user);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function readAllCourseIds(keys: any): Promise<string[]> {
  const courseList = [];
  const auth = getAuth();
  const email = keys.tutorsStoreId;
  const secret = keys.tutorsStoreSecret;
  await signInWithEmailAndPassword(auth, email, secret);
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
