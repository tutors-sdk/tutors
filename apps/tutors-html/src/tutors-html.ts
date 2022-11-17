#!/usr/bin/env node
import * as fs from "fs";
import { Course } from "tutors-lib/src/models/course";
import { HtmlEmitter } from "./controllers/html-emitter";
import { copyFolder } from "tutors-lib/src/utils/futils";
import * as nunjucks from "nunjucks";

const version = `tutors-html: 2.6.2 (tutors-lib: 2.6.2)`;

const root = __dirname;
nunjucks.configure(root + "/views", { autoescape: false });
nunjucks.installJinjaCompat();

if (fs.existsSync("course.md")) {
  const folder = process.cwd() + "/public-site";
  const course = new Course();
  console.log(`Static course generator ${version}`);
  course.publish(folder);
  const emitter = new HtmlEmitter();
  emitter.generateCourse(folder, course);
  console.log(`${version}`);
  copyFolder(`${root}/src/assets`, folder);
} else {
  console.log("Cannot locate course.md. Change to course folder and try again. ");
}
