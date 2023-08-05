import * as sh from "shelljs";
import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
import { buildCourseTree } from "./course-tree";
import { writeFile } from "tutors-gen-lib/src/utils/utils";
import * as nunjucks from "nunjucks";

export function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, { lo: lo }));
}

export const courseBuilderHtml = {
  emitNote(lo: LearningObject, path: string) {
    const notePath = `${path}/${lo.id}`;
    publishTemplate(notePath, "index.html", "Note.njk", lo);
  },

  emitLab(lo: LearningObject, path: string) {
    const labPath = `${path}/${lo.id}`;
    publishTemplate(labPath, "index.html", "Lab.njk", lo);
  },

  emitLoPage(lo: LearningObject, path: string) {
    if (lo.type == "lab") {
      this.emitLab(lo as LearningObject, path);
    }
    if (lo.type == "note" || lo.type == "panelnote") {
      this.emitNote(lo as LearningObject, path);
    }
  },

  emitUnit(lo: LearningObject, path: string) {
    lo.los.forEach((lo) => {
      this.emitLoPage(lo, path);
    });
  },

  emitLo(lo: LearningObject, path: string) {
    if (lo.type == "unit" || lo.type == "side") {
      const unitPath = `${path}/${lo.id}`;
      this.emitUnit(lo, unitPath);
    } else {
      this.emitLoPage(lo, path);
    }
  },

  emitTopic(lo: LearningObject, path: string) {
    sh.cd(lo.id);
    const topicPath = `${path}/${lo.id}`;
    lo?.los?.forEach((lo) => {
      this.emitLo(lo as LearningObject, topicPath);
    });
    publishTemplate(topicPath, "index.html", "Topic.njk", lo);
    sh.cd("..");
  },

  generateCourse(path: string, lo: LearningObject) {
    buildCourseTree(lo);
    sh.cd(path);
    lo.los.forEach((lo) => {
      this.emitTopic(lo as LearningObject, path);
    });
    publishTemplate(path, "index.html", "Course.njk", lo);
  },
};
