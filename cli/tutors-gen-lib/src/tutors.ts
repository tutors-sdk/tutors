import { courseBuilder } from "./lo/course-builder";
import { decorateCourseTree } from "./lo/course-tree";
import { Lo } from "./lo/lo-types";
import { resourceBuilder } from "./lr/resource-builder";
import { writeFile } from "./utils/file-utils";
import { generateNetlifyToml } from "./utils/netlify";

export const version = "3.0.8";

export function buildCourse(folder: string): Lo {
  resourceBuilder.buildTree(folder);
  courseBuilder.buildCourse(resourceBuilder.lr);
  return courseBuilder.lo;
}

export function generateCourse(lo: Lo, folder: string) {
  resourceBuilder.copyAssets(folder);
  writeFile(folder, "tutors.json", JSON.stringify(lo));
  generateNetlifyToml(folder);
}

export function decorateCourse(lo: Lo) {
  decorateCourseTree(lo);
}
