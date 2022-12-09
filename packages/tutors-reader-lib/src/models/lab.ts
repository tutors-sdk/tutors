import type { Lo } from "../types/lo-types";
import { convertMd } from "../utils/markdown-utils";
import { removeLeadingHashes } from "../utils/lo-utils";
import type { Course } from "./course";

export class Lab {
  course: Course;
  lo: Lo = null;
  url = "";
  objectivesHtml = "";
  currentChapterShortTitle = "";
  currentChapterTitle = "";
  navbarHtml = "";
  horizontalNavbarHtml = "";
  content = "";
  chaptersHtml = new Map<string, string>();
  chaptersTitles = new Map<string, string>();
  steps: string[] = [];
  autoNumber = false;

  vertical = true;

  constructor(course: Course, lo: Lo, labId: string) {
    this.course = course;
    this.autoNumber = course.areLabStepsAutoNumbered();
    this.url = labId;
    this.lo = lo;
    const assetUrl = labId.replace(`/lab/${course.id}`, course.url);
    this.objectivesHtml = convertMd(this.lo.los[0].contentMd, assetUrl);
    this.lo.los.forEach((chapter) => {
      this.chaptersHtml.set(encodeURI(chapter.shortTitle), convertMd(chapter.contentMd, assetUrl));
      this.chaptersTitles.set(chapter.shortTitle, removeLeadingHashes(chapter.title));
    });
    this.steps = Array.from(this.chaptersHtml.keys());
  }

  refreshNav() {
    let nav = "";
    this.horizontalNavbarHtml = "";

    this.lo.los.forEach((chapter, i) => {
      const number = this.autoNumber == true ? chapter.shortTitle + ": " : "";
      const active = encodeURI(chapter.shortTitle) == this.currentChapterShortTitle ? "font-bold bg-primary-100 dark:bg-primary-800 pl-4" : "";
      const title = this.chaptersTitles.get(chapter.shortTitle);
      nav = nav.concat(`<a href="${this.url}/${encodeURI(chapter.shortTitle)}"><li class="py-2 px-4 ${active}">${number}${title}</li></a>`);

      // horizontal nav
      if (encodeURI(chapter.shortTitle) == this.currentChapterShortTitle) {
        if (this.lo.los[i - 1] !== undefined) {
          const nav = this.lo.los[i - 1];
          const title = this.chaptersTitles.get(nav.shortTitle);
          this.horizontalNavbarHtml = this.horizontalNavbarHtml.concat(
            `<a class="btn btn-sm capitalize" href="${this.url}/${encodeURI(nav.shortTitle)}"> <span aria-hidden="true">&larr;</span>&nbsp; ${number}${title} </a>`
          );
        }
        if (this.lo.los[i + 1] !== undefined) {
          const nav = this.lo.los[i + 1];
          const title = this.chaptersTitles.get(nav.shortTitle);
          this.horizontalNavbarHtml = this.horizontalNavbarHtml.concat(
            `<a class="ml-auto btn btn-sm capitalize" style="margin-left: auto" href="${this.url}/${encodeURI(
              nav.shortTitle
            )}"> ${number}${title} &nbsp;<span aria-hidden="true">&rarr;</span></a>`
          );
        }
      }
    });
    this.navbarHtml = nav;
  }

  setFirstPageActive() {
    const startStep = encodeURI(this.lo.los[0].shortTitle);
    this.currentChapterShortTitle = startStep;
    this.currentChapterTitle = this.chaptersTitles.get(startStep);
    this.content = this.chaptersHtml.get(startStep);
    this.refreshNav();
  }

  setActivePage(step: string) {
    if (this.steps.indexOf(step) < 0) return;
    this.currentChapterShortTitle = step;
    this.currentChapterTitle = this.chaptersTitles.get(step);
    this.content = this.chaptersHtml.get(step);
    this.refreshNav();
  }

  nextStep(): string {
    let step = "";
    const itemIndex = this.steps.indexOf(this.currentChapterShortTitle);
    if (itemIndex < this.steps.length - 1) {
      step = this.steps[itemIndex + 1];
    }
    return step;
  }

  prevStep(): string {
    let step = "";
    const itemIndex = this.steps.indexOf(this.currentChapterShortTitle);
    if (itemIndex > 0) {
      step = this.steps[itemIndex - 1];
    }
    return step;
  }
}
