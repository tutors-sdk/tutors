#!/usr/bin/env node
import * as fs from "fs";
import { Course } from "tutors-lib/src/models/course";
import { JsonEmitter } from "./controllers/json-emitter";
import { generateNetlifyToml } from "./controllers/netlify";
const version = `tutors-json 2.6.2 (tutors-lib: 2.6.2)`;

if (fs.existsSync("course.md")) {
  const course = new Course();
  const folder = process.cwd() + "/json";
  console.log(`Static course generator ${version}`);
  course.publish(folder);
  const emitter = new JsonEmitter();
  emitter.generateCourse(version, folder, course);
  generateNetlifyToml(folder);
  console.log(` ${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
