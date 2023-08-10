#!/usr/bin/env node
import * as fs from "fs";
import { buildCourse, decorateCourse, generateCourse, version } from "tutors-gen-lib/src/tutors";
import { emitCourse } from "./course-emitter";

const versionStr = `tutors-publish-html: ${version}`;
console.log(versionStr);

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Change to course folder and try again. ");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/html`;
  const lo = buildCourse(srcFolder);
  generateCourse(lo, destFolder);
  decorateCourse(lo);
  emitCourse(destFolder, lo);
}
console.log(versionStr);
