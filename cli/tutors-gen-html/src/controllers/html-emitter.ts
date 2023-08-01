import * as sh from "shelljs";
import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
import { writeFile } from "tutors-gen-lib/src/utils/utils";
import * as nunjucks from "nunjucks";
import { convertMdToHtml } from "../utils/markdown-utils";

export function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, lo));
}

export const courseBuilderHtml = {

  emitObjectves(lo: LearningObject) {
    // if (lo.frontMatter && lo.frontMatter.icon) {
    //   lo.icon = {
    //     type: lo.frontMatter.icon["type"],
    //     color: lo.frontMatter.icon["color"],
    //   };
    // }
    if (lo && lo.contentMd && lo.contentMd.length > 60) {
      lo.contentMd = lo?.contentMd?.substring(0, 60);
      lo.contentMd = lo?.contentMd?.concat("...");
    }
    if (lo.contentMd) lo.contentHtml = convertMdToHtml(lo.contentMd);
  },

  emitNote(note: LearningObject, path: string) {
    note.contentHtml = convertMdToHtml(note.contentMd);
    const notePath = `${path}/${note.id}`;
    const obj = {
      lo: note
    }
    publishTemplate(notePath, "index.html", "Note.njk", obj);
  },

  emitLab(lab: LearningObject, path: string) {
    lab.los.forEach((chapter) => {
      chapter.contentHtml = convertMdToHtml(chapter.contentMd);
      //chapter.title = convertMdToHtml(chapter.title);
    });
    const labPath = `${path}/${lab.id}`;
    const obj = {
      lo: lab
    }
    publishTemplate(labPath, "index.html", "Lab.njk", obj);
  },

  emitUnit(unit: LearningObject, path: string) {
    unit.los.forEach((lo) => {
      //this.emitObjectves(lo as LearningObject);
      if (lo.type == "lab") {
        this.emitLab(lo as LearningObject, path);
      }
      if (lo.type == "note") {
        this.emitNote(lo as LearningObject, path);
      }
      if (lo.type == "panelnote") {
        const note = lo;
        note.contentMd = this.parser.parse(note.contentMd);
      }
    });
    // unit.standardLos = sortLos(unit.standardLos);
  },

  emitLo(lo: LearningObject, path: string) {
    if (lo.type == "unit") {
      const unitPath = `${path}/${lo.id}`;
      this.emitUnit(lo, unitPath);
    } else {
      if (lo.type == "lab") {
        this.emitLab(lo, path);
      }
      if (lo.type == "panelnote") {
        this.emitNote(lo, path);
      }
      if (lo.type == "note") {
        this.emitNote(lo, path);
      }
      this.emitObjectves(lo);
    }
  },

  emitTopic(topic: LearningObject, path: string) {
    sh.cd(topic.id);
    this.emitObjectves(topic);
    const topicPath = `${path}/${topic.id}`;
    topic?.los?.forEach((lo) => {
      this.emitLo(lo as LearningObject, topicPath);
    });
    const units = topic?.los?.filter((lo: any) => lo.lotype !== "unit");
    const standardLos = topic?.los?.filter((lo: any) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk");
    const obj = {
      lo: topic,
      standardLos: standardLos,
      units: units
    };
    publishTemplate(topicPath, "index.html", "Topic.njk", obj);
    sh.cd("..");
  },

  emitCourse(course: LearningObject, path: string) {
    course.los.forEach((lo) => {
      this.emitTopic(lo as LearningObject, path);
    });
    publishTemplate(path, "index.html", "Course.njk", { lo: course });
  },

  generateCourse(path: string, course: LearningObject) {
    sh.cd(path);
    this.emitCourse(course, path);
  }
}
