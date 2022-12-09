import * as sh from "shelljs";
import { Course } from "tutors-lib/src/models/course";
import { writeFile } from "tutors-lib/src/utils/futils";
import { Topic, Unit } from "tutors-lib/src/models/topic";
import { Lab } from "tutors-lib/src/models/lab";
import { MarkdownParser } from "../utils/markdown-parser";
import { LearningObject } from "tutors-lib/src/models/lo";
import { Note } from "tutors-lib/src/models/note";
import { generateToc } from "../utils/markdown-toc-lib";
import { sortLos } from "tutors-lib/src/utils/loutils";
import * as nunjucks from "nunjucks";

export function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, { lo: lo }));
}

export class HtmlEmitter {
  parser = new MarkdownParser();

  emitObjectves(lo: LearningObject) {
    if (lo.frontMatter && lo.frontMatter.icon) {
      lo.icon = {
        type: lo.frontMatter.icon["type"],
        color: lo.frontMatter.icon["color"],
      };
    }
    if (lo && lo.objectivesMd && lo.objectivesMd.length > 60) {
      lo.objectivesMd = lo?.objectivesMd?.substring(0, 60);
      lo.objectivesMd = lo?.objectivesMd?.concat("...");
    }
    if (lo.objectivesMd) lo.objectives = this.parser.parse(lo.objectivesMd);
  }

  emitNote(note: Note, path: string) {
    note.contentMd = this.parser.parse(note.contentMd);
    note.contentMd = generateToc(note.contentMd);
    const notePath = `${path}/${note.folder}`;
    publishTemplate(notePath, "index.html", "Note.njk", note);
  }

  emitLab(lab: Lab, path: string) {
    lab.chapters.forEach((chapter) => {
      chapter.content = this.parser.parse(chapter.contentMd);
      chapter.title = this.parser.parse(chapter.title);
    });
    const labPath = `${path}/${lab.folder}`;
    publishTemplate(labPath, "index.html", "Lab.njk", lab);
  }

  emitUnit(unit: Unit, path: string) {
    unit.los.forEach((lo) => {
      this.emitObjectves(lo);
      if (lo.lotype == "lab") {
        this.emitLab(lo as Lab, path);
      }
      if (lo.lotype == "panelnote") {
        const note = lo as Note;
        note.contentMd = this.parser.parse(note.contentMd);
        note.contentMd = generateToc(note.contentMd);
      }
    });
    unit.standardLos = sortLos(unit.standardLos);
  }

  emitLo(lo: LearningObject, path: string) {
    if (lo.lotype == "unit") {
      const unitPath = `${path}/${lo.folder}`;
      this.emitUnit(lo as Unit, unitPath);
    } else {
      if (lo.lotype == "lab") {
        this.emitLab(lo as Lab, path);
      }
      if (lo.lotype == "panelnote") {
        this.emitNote(lo as Note, path);
      }
      if (lo.lotype == "note") {
        this.emitNote(lo as Note, path);
      }
      this.emitObjectves(lo);
    }
  }

  emitTopic(topic: Topic, path: string) {
    sh.cd(topic.folder);
    this.emitObjectves(topic);
    const topicPath = `${path}/${topic.folder}`;
    topic?.los?.forEach((lo) => {
      this.emitLo(lo, topicPath);
    });
    topic.standardLos = topic?.los?.filter((lo: LearningObject) => lo.lotype !== "unit" && lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk");
    publishTemplate(topicPath, "index.html", "Topic.njk", topic);
    sh.cd("..");
  }

  emitCourse(course: Course, path: string) {
    course.los.forEach((lo) => {
      this.emitTopic(lo as Topic, path);
    });
    publishTemplate(path, "index.html", "Course.njk", course);
  }

  generateCourse(path: string, course: Course) {
    sh.cd(path);
    this.emitCourse(course, path);
  }
}
