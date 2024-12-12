import type { Course, Lab, Note, Lo } from "./models/lo-types";
import { convertMdToHtml } from "./models/markdown-utils";

export const markdownService = {
  convertLabToHtml(course: Course, lab: Lab, theme: string) {
    lab.summary = convertMdToHtml(lab.summary, theme);
    const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
    lab?.los?.forEach((step) => {
      if (course.courseUrl) {
        step.contentMd = this.filter(step.contentMd, url);
      }
      step.contentHtml = convertMdToHtml(step.contentMd, theme);
      step.parentLo = lab;
      step.type = "step";
    });
  },

  convertNoteToHtml(note: Note, theme: string) {
    note.summary = convertMdToHtml(note.summary, theme);
    note.contentHtml = convertMdToHtml(note.contentMd, theme);
  },

  convertLoToHtml(course: Course, lo: Lo, theme: string = "monokai") {
    if (lo.type === "lab" || lo.type == "note") {
      // convertLabToHtml(course, lo as Lab);
    } else {
      if (lo.summary) lo.summary = convertMdToHtml(lo.summary, theme);
      let md = lo.contentMd;
      if (md) {
        if (course.courseUrl) {
          const url = lo.route.replace(`/${lo.type}/${course.courseId}`, course.courseUrl);
          md = this.filter(md, url);
        }
        lo.contentHtml = convertMdToHtml(md, theme);
      }
    }
  },

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
  },

  filter(src: string, url: string): string {
    let filtered = this.replaceAll(src, "./img\\/", `img/`);
    filtered = this.replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = this.replaceAll(filtered, "./archives\\/", `archives/`);

    //filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
    filtered = this.replaceAll(filtered, "(?<!/)archives\\/", `https://${url}/archives/`);

    // filtered = replaceAll(filtered, "./archive\\/(?!refs)", `archive/`);
    filtered = this.replaceAll(filtered, "(?<!/)archive\\/(?!refs)", `https://${url}/archive/`);
    filtered = this.replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    return filtered;
  }
};
