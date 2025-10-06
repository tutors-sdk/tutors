import {
  parseCourse,
  generateDynamicCourse,
  copyAssets,
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import process from "node:process";

const versionStr = `tutors: 4.2.2`;

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  const [course, lr] = parseCourse(srcFolder);
  generateDynamicCourse(course, destFolder);
  copyAssets(lr, destFolder);
}
console.log(versionStr);  