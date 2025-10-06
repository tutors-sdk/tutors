import { buildCourse } from "./services/course-builder.ts";
import { decorateCourseTree } from "@tutors/tutors-model-lib";
import type { Course, Lo } from "@tutors/tutors-model-lib";

import * as fs from "node:fs";
import * as path from "node:path";

import { writeFile } from "./utils/file-utils.ts";
import { generateNetlifyToml } from "./utils/netlify.ts";
import { generateLlms } from "./utils/llms.ts";
import { emitStaticCourse } from "./services/course-emitter.ts";
import { downloadVentoTemplates } from "./templates/template-downloader.ts";
import { initTemplateEngine } from "./templates/template-engine.ts";
import { buildTree, copyAssetFiles } from "./services/resource-builder.ts";
import type { LearningResource } from "./types/types.ts";

export function parseCourse(folder: string, silent: boolean = false): [Course, LearningResource] {
  const lr = buildTree(folder);
  const course = buildCourse(lr, silent);
  return [course, lr];
}

export function copyAssets(lr: LearningResource, folder: string) {
  copyAssetFiles(lr, folder);
}

export function decorateCourse(course: Course) {
  decorateCourseTree(course);
}

export function generateDynamicCourse(lo: Lo, folder: string) : boolean {
  writeFile(folder, "tutors.json", JSON.stringify(lo));
  generateNetlifyToml(folder);
  generateLlms(lo as Course, folder);
  return true;
}

export async function generateStaticCourse(course: Course, destFolder: string, srcVentoFolder: string = "") : Promise<boolean>  {
  try {
    await downloadVentoTemplates(destFolder, srcVentoFolder);
    decorateCourseTree(course);
    initTemplateEngine(destFolder);
    await emitStaticCourse(destFolder, course);
    return true;
  } catch (error) {
    console.error('Error generating static course:', error);
    return false;
  }
}

export function version(): string {
  const denoJsonPath = path.resolve(import.meta.dirname, "../deno.json");
  const pkg = JSON.parse(fs.readFileSync(denoJsonPath, "utf8"));
  const versionStr = `${pkg.version}`;
  return versionStr;
}