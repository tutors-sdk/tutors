import {
  parseCourse,
  generateStaticCourse,
  copyAssets, version
} from "@tutors/tutors-gen-lib";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

const denoJsonPath = path.resolve(import.meta.dirname, "./deno.json");
const pkg = JSON.parse(fs.readFileSync(denoJsonPath, "utf8"));
const tutorsLiteVersion = `${pkg.version}`;

const srcVentoFolder = "/Users/edeleastar/repos/tutor-sdk/apps/tutors-apps/cli/tutors-gen-lib/src/templates/vento"; 

if (!fs.existsSync("course.md")) {
  console.log("Cannot locate course.md. Please change to course folder and try again.");
} else {
  const srcFolder = process.cwd();
  const destFolder = `${srcFolder}/html`;
  const [course, lr] = parseCourse(srcFolder);
  generateStaticCourse(course, destFolder);//, srcVentoFolder);
  copyAssets(lr, destFolder);
}
console.log(`Tutors Lite: ${tutorsLiteVersion} (Tutors Lib ${version()})`);
