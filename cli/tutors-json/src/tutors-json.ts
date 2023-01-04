#!/usr/bin/env node
import * as fs from "fs";
import { Course } from "tutors-lib/src/models/course";
import { courseBuilder } from "./builders/course-builder";
import { resourceBuilder } from "./builders/resource-builder";
import { JsonEmitter } from "./controllers/json-emitter";
import { generateNetlifyToml } from "./controllers/netlify";
const version = `tutors-json 2.6.2 (tutors-lib: 2.6.2)`;

const newVersion = true;

if (fs.existsSync("course.md")) {
  const course = new Course();
  const folder = process.cwd() + "/json";
  console.log(`Static course generator ${version}`);
  if (newVersion) {
    resourceBuilder.buildTree(process.cwd());
    courseBuilder.buildCourse(resourceBuilder.lr);
    courseBuilder.generateCourse("json");
  } else {
    course.publish(folder);
    const emitter = new JsonEmitter();
    emitter.generateCourse(version, folder, course);
  }
  generateNetlifyToml(folder);
  console.log(` ${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
