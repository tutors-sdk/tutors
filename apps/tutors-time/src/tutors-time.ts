import { initFirebase, readAllCourseIds } from "./filrebase-utils";
import { firebase } from "./environment";

async function run() {
  await initFirebase(firebase);
  const courseIds = await readAllCourseIds(firebase);
  console.log(courseIds);
}

void run();
