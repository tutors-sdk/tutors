#!/usr/bin/env node
import { existsSync } from "node:fs";
import { parseCourse, generateDynamicCourse } from "@tutors/tutors-gen-lib";
import process from "node:process";

const versionStr = `tutors-publish-npm: 4.2.0`;

if (!existsSync("course.md")) {
  console.log(
    "Cannot locate course.md. Please Change to course folder and try again. "
  );
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  const [course] = parseCourse(srcFolder);
  generateDynamicCourse(course, destFolder);
}
console.log(versionStr);
