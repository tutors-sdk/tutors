import { fetchAllCourseAccess, pruneInvalid, prunePreviews, readAllCourseIds, readAllUsageData } from "./time-utils";
import { firebase } from "./environment";
import { fetchAllAtNode, initFirebase, writeNode } from "./filrebase-utils";
import { writeFileSync } from "fs";

function compareFn(a: any, b: any) {
  if (a?.visits < b?.visits) {
    return 1;
  }
  if (a?.visits > b?.visits) {
    return -1;
  }
  return 0;
}

function printIds(courseIds: string[]) {
  courseIds.forEach((courseId) => console.log(courseId));
  console.log(`${courseIds.length} Courses.`);
}

async function run() {
  await initFirebase(firebase);
  // Read all IDs
  console.log("Reading all Ids...");
  let courseIds = await readAllCourseIds(firebase, "all-course-access");
  printIds(courseIds);

  // remove invalid ids
  //  console.log("Removing previews & invalid courses...");
  //  await prunePreviews("all-course-access", courseIds);
  //  await pruneInvalid("all-course-access", courseIds);
  //  courseIds = await readAllCourseIds(firebase, "all-course-access");
  //  console.log(`${courseIds.length} Courses after pruning`);

  // gather all usage data
  //console.log("Reading all usage data...");
  //const usageDetails = await readAllUsageData(firebase, courseIds);

  // usageDetails = usageDetails.filter((usage) => usage?.visits > 50);
  // usageDetails.sort(compareFn);
  // console.log(`${usageDetails.length} Courses`);
  //for (let i = 0; i < usageDetails.length; i++) {
  //  console.log(`${usageDetails[i]?.title}:${usageDetails[i]?.visits}`);
  // }
  // console.log("Writing usage json...");
  // const json = JSON.stringify(usageDetails);
  // writeFileSync("myjsonfile.json", json, "utf8");

  // Writing data to all-course-access
  // console.log("Writing usage data to all-course-accsss.");
  // await writeNode("all-course-access", usageDetails);

  //const usageDetails = await fetchAllCourseAccess();
  //console.log(usageDetails);
  //console.log("Done");
}

void run();
