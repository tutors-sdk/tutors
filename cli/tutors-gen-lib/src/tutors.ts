import { buildCourse } from "./services/course-builder.ts";
import { decorateCourseTree } from "@tutors/tutors-model-lib";
import type { Course, Lo } from "@tutors/tutors-model-lib";
import { resourceBuilder } from "./services/resource-builder.ts";
import { writeFile } from "./utils/file-utils.ts";
import { generateNetlifyToml } from "./utils/netlify.ts";
import { generateLlms } from "./utils/llms.ts";
import { emitStaticCourse } from "./services/course-emitter.ts";
import { downloadVentoTemplates } from "./templates/template-downloader.ts";

export function parseCourse(folder: string): Course {
  resourceBuilder.buildTree(folder);
  const course = buildCourse(resourceBuilder.lr);
  return course;
}

export function decorateCourse(course: Course) {
  decorateCourseTree(course);
}

export function generateDynamicCourse(lo: Lo, folder: string) {
  resourceBuilder.copyAssets(folder);
  writeFile(folder, "tutors.json", JSON.stringify(lo));
  generateNetlifyToml(folder);
  generateLlms(lo as Course, folder);
}

export async function generateStaticCourse(course: Course, folder: string) {
  resourceBuilder.copyAssets(folder);
  await downloadVentoTemplates(folder);
  decorateCourseTree(course);
  emitStaticCourse(folder, course);
}