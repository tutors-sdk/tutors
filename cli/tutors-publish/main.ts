import {
  parseCourse,
  generateDynamicCourse,
  copyAssets,
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import process from "node:process";
import { parseArgs } from "jsr:@std/cli/parse-args";

const versionStr = `tutors-publish: 4.1.2`;

const flags = parseArgs(Deno.args, {
  boolean: ["silent"],
  string: ["version"],
});

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/json`;
  const lo = parseCourse(srcFolder, flags.silent);
  generateDynamicCourse(lo, destFolder);
}
console.log(versionStr);  