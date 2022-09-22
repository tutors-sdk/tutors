#!/usr/bin/env node
import * as fs from "fs";
import { Course } from "tutors-lib/src/models/course";
import { JsonEmitter } from "./controllers/json-emitter";
import { generateNetlifyToml } from "./controllers/netlify";
const tutors = require("../package.json").version;
const tutors_lib = require("../package.json").dependencies["tutors-lib"];
const version = `tutors-json ${tutors} (tutors-lib: ${tutors_lib})`;

if (fs.existsSync("course.md")) {
  const course = new Course();
  let folder = process.cwd() + "/json";
  console.log(`Static course generator ${version}`);
  course.publish(folder);
  const emitter = new JsonEmitter();
  emitter.generateCourse(version, folder, course);
  generateNetlifyToml(folder);
  console.log(` ${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
