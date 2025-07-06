import {
  parseCourse,
  generateStaticCourse
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import process from "node:process";

const versionStr = `tutors-publish-html: 4.1.1`;

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/html`;
  const lo = parseCourse(srcFolder);
  generateStaticCourse(lo, destFolder);
}
console.log(versionStr);
