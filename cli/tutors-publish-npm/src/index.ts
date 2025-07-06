#!/usr/bin/env node
import { existsSync } from "fs";
import { parseCourse, generateDynamicCourse } from "@tutors/tutors-gen-lib";

const versionStr = `tutors-publish-npm: 4.1.1`;

if (!existsSync("course.md")) {
  console.log(
    "Cannot locate course.md. Please Change to course folder and try again. "
  );
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  const lo = parseCourse(srcFolder);
  generateDynamicCourse(lo, destFolder);
}
console.log(versionStr);
