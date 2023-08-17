"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const filrebase_utils_1 = require("./filrebase-utils");
async function run() {
    await (0, filrebase_utils_1.initFirebase)(environment_1.firebase);
    console.log("Reading all Ids...");
    let courseIds = await (0, filrebase_utils_1.readAllCourseIds)(environment_1.firebase, "");
    const validCourses = courseIds.filter((courseId) => (0, filrebase_utils_1.isValidCourseName)(courseId));
    const invalidCourses = courseIds.filter((courseId) => !(0, filrebase_utils_1.isValidCourseName)(courseId));
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
//# sourceMappingURL=tutors-time.js.map