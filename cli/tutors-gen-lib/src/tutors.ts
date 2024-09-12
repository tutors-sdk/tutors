import { buildCourse } from "./generator/course-builder";
import { decorateCourseTree } from "./models/lo-tree";
import { Course, Lo } from "./models/lo-types";
import { resourceBuilder } from "./generator/resource-builder";
import { writeFile } from "./generator/file-utils";
import { generateNetlifyToml } from "./generator/netlify";

export const version = "3.3.1";

export function parseCourse(folder: string): Course {
  resourceBuilder.buildTree(folder);
  const course = buildCourse(resourceBuilder.lr);
  return course;
}

export function generateCourse(lo: Lo, folder: string) {
  resourceBuilder.copyAssets(folder);
  writeFile(folder, "tutors.json", JSON.stringify(lo));
  generateNetlifyToml(folder);
}

export function decorateCourse(course: Course) {
  decorateCourseTree(course);
}
