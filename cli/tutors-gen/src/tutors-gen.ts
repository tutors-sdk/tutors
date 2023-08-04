#!/usr/bin/env node
import * as fs from "fs";
import { courseBuilder } from "tutors-gen-lib/src/lo/course-builder";
import { resourceBuilder } from "tutors-gen-lib/src/lo/resource-builder";
import { generateNetlifyToml } from "tutors-gen-lib/src/utils/netlify";
import { writeFile } from "tutors-gen-lib/src/utils/utils";
const version = `tutors-gen 3.0.0 (tutors-gen-lib: 0.0.1)`;

if (fs.existsSync("course.md")) {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  console.log(`Static course generator ${version}`);
  resourceBuilder.buildTree(srcFolder);
  courseBuilder.buildCourse(resourceBuilder.lr);
  resourceBuilder.copyAssets(destFolder);
  writeFile(destFolder, "tutors.json", JSON.stringify(courseBuilder.lo));
  generateNetlifyToml(destFolder);
  console.log(`${version}`);
} else {
  console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
