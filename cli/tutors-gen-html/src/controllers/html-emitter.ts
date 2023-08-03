import * as sh from "shelljs";
import { LearningObject } from "tutors-gen-lib/src/lo/lo-types";
import { writeFile } from "tutors-gen-lib/src/utils/utils";
import * as nunjucks from "nunjucks";
import { convertMdToHtml } from "../utils/markdown-utils";

export function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, lo));
}

export function threadLos(parent: LearningObject) {
  for (const lo of parent.los) {
    if (lo.contentMd) {
      lo.contentHtml = convertMdToHtml(lo.contentMd);
    }
    const obj = lo as LearningObject
    obj.parentLo = parent;
    if (obj.frontMatter && obj.frontMatter.icon) {
      obj.icon = {
        type: obj.frontMatter.icon["type"],
        color: obj.frontMatter.icon["color"],
      };
    } else {
      obj.icon = null;
    }
    if (obj.los) {
      threadLos(obj);
    }
  }
}

export const courseBuilderHtml = {

  emitLo(lo: LearningObject, path: string) {
    if (lo.type == "unit" || lo.type == "side") {
      const unitPath = `${path}/${lo.id}`;
      this.emitUnit(lo, unitPath);
    } else {
      if (lo.type == "lab") {
        this.emitLab(lo, path);
      }
      if (lo.type == "note" || lo.type == "panelnote") {
        this.emitNote(lo, path);
      }
    }
  },

  emitNote(note: LearningObject, path: string) {
    const notePath = `${path}/${note.id}`;
    publishTemplate(notePath, "index.html", "Note.njk", {
      lo: note
    });
  },

  emitLab(lab: LearningObject, path: string) {
    const labPath = `${path}/${lab.id}`;
    publishTemplate(labPath, "index.html", "Lab.njk", {
      lo: lab
    });
  },

  emitUnit(unit: LearningObject, path: string) {
    unit.los.forEach((lo) => {
      if (lo.type == "lab") {
        this.emitLab(lo as LearningObject, path);
      }
      if (lo.type == "note" || lo.type == "panelnote") {
        this.emitNote(lo as LearningObject, path);
      }
    });
    unit.panels = {
      panelVideos: unit.los?.filter((lo: any) => lo.type === "panelvideo"),
      panelTalks: unit.los?.filter((lo: any) => lo.type === "paneltalk"),
      panelNotes: unit.los?.filter((lo: any) => lo.type === "panelnote")
    }
  },

  emitTopic(lo: LearningObject, path: string) {
    sh.cd(lo.id);
    const topicPath = `${path}/${lo.id}`;
    lo?.los?.forEach((lo) => {
      this.emitLo(lo as LearningObject, topicPath);
    });
    lo.panels = {
      panelVideos: lo?.los?.filter((lo: any) => lo.type === "panelvideo"),
      panelTalks: lo?.los?.filter((lo: any) => lo.type === "paneltalk"),
      panelNotes: lo?.los?.filter((lo: any) => lo.type === "panelnote")
    };
    lo.units = lo?.los?.filter((lo: any) => lo.type === "unit");
    lo.sides = lo?.los?.filter((lo: any) => lo.type === "side");
    lo.standardLos = lo?.los?.filter((lo: any) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "side");
    publishTemplate(topicPath, "index.html", "Topic.njk", {
      lo: lo,
    });
    sh.cd("..");
  },

  generateCourse(path: string, lo: LearningObject) {
    threadLos(lo);
    sh.cd(path);
    lo.los.forEach((lo) => {
      this.emitTopic(lo as LearningObject, path);
    });
    publishTemplate(path, "index.html", "Course.njk", { lo: lo });
  }
}
