#!/usr/bin/env node
import * as fs from "fs";
import { courseBuilder } from "./builders/course-builder";
import { resourceBuilder } from "./builders/resource-builder";
import { generateNetlifyToml } from "./utils/netlify";
const version = `tutors-gen 2.8.0`;

if (fs.existsSync("course.md")) {
  const folder = process.cwd() + "/json";
  console.log(`Static course generator ${version}`);
  resourceBuilder.buildTree(process.cwd());
  courseBuilder.buildCourse(resourceBuilder.lr);
  courseBuilder.generateCourse("json");
  generateNetlifyToml(folder);
  console.log(` ${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
