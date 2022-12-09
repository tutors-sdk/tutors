import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, ref, runTransaction, remove, set } from "firebase/database";

export function getNode(lotype: string, url: string, path: string): string {
  let node = "";
  if (lotype !== "course") {
    node = sanatisePath(url, path);
  }
  return node;
}

export function sanitise(str): string {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[`#$.\[\]]/gi, "*");
}

export function updateLastAccess(key: string, title: string) {
  updateStr(`${key}/last`, new Date().toLocaleString());
  updateStr(`${key}/title`, title);
}

export function updateVisits(key: string) {
  updateCountValue(`${key}/visits`);
}

export function updateCount(key: string) {
  updateCountValue(`${key}/count`);
}

export async function readValue(key: string): Promise<string> {
  const dbRef = ref(getDatabase());
  const snapShot = await get(child(dbRef, key));
  return snapShot.val();
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
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, "all-course-access"));
  const courseList: any[] = [];
  if (snapshot.exists()) {
    const courseObjs: any = snapshot.val();
    let course: any;
    for (const [key, value] of Object.entries(courseObjs)) {
      try {
        course = value;
        if (course) {
          course.courseId = key;
          courseList.push(course);
        }
      } catch (error) {
        console.log("TutorStore Error");
      }
    }
  }
  return courseList;
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

export async function initFirebase(keys: any) {
  if (keys.apiKey !== "XXX") {
    initializeApp(keys);
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, keys.tutorStoreId, keys.tutorStoreSecret);
  }
}

export async function readAllCourseIds(keys: any): Promise<string[]> {
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

export async function readAllCourseAccessIds(keys: any): Promise<any[]> {
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
