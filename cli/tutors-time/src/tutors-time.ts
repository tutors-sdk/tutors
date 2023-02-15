import { firebase } from "./environment";
import { deleteNode, initFirebase, isValidCourseName, readAllCourseIds, readVisits } from "./filrebase-utils";

async function run() {
  await initFirebase(firebase);
  console.log("Reading all Ids...");
  let courseIds = await readAllCourseIds(firebase, "");
  const validCourses = courseIds.filter((courseId) => isValidCourseName(courseId));
  const invalidCourses = courseIds.filter((courseId) => !isValidCourseName(courseId));
  console.log(`Number of courses: ${courseIds.length}`);
  console.log(`Number of Valid courses: ${validCourses.length}`);
  console.log(`Number of Invalid courses: ${invalidCourses.length}`);

  // invalidCourses.forEach(async (courseId) => {
  //   console.log(`deleting ... ${courseId}: `);
  //   deleteNode(courseId, "");
  // });

  // validCourses.forEach(async (courseId) => {
  //   const visits = await readVisits(courseId);
  //   if (!visits) {
  //     console.log(`deleting ... ${courseId}: `);
  //     deleteNode(courseId, "");
  //   }
  // });
}

void run();
