import {
  parseCourse,
  generateStaticCourse,
  copyAssets
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import process from "node:process";

const versionStr = `tutors-publish-html: 4.1.2`;

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/html`;
  const [course, lr] = parseCourse(srcFolder);
  generateStaticCourse(course, destFolder);
  copyAssets(lr, destFolder);
}
console.log(versionStr);
