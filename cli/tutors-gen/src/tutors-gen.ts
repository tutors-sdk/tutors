#!/usr/bin/env node
import * as fs from "fs";
import { courseBuilder } from "./builders/course-builder";
import { resourceBuilder } from "./builders/resource-builder";
import { generateNetlifyToml } from "./utils/netlify";
const version = `tutors-gen 2.9.12`;

if (fs.existsSync("course.md")) {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  console.log(`Static course generator ${version}`);
  resourceBuilder.buildTree(srcFolder);
  courseBuilder.buildCourse(resourceBuilder.lr);
  resourceBuilder.copyAssets(destFolder);
  courseBuilder.generateCourse(destFolder);
  generateNetlifyToml(destFolder);
  console.log(`${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
