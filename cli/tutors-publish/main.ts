import {
  parseCourse,
  generateDynamicCourse,
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import process from "node:process";

const versionStr = `tutors-publish: 0.0.54`;

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  const lo = parseCourse(srcFolder);
  generateDynamicCourse(lo, destFolder);
}
console.log(versionStr);  