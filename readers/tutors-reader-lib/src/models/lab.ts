import type {Lo} from "../types/lo-types";
import {convertMd} from "../utils/markdown-utils";
import {removeLeadingHashes} from "../utils/lo-utils";
import type {Course} from "./course";

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

  constructor(course: Course, lo: Lo, url: string) {
    this.course = course;
    this.autoNumber = course.areLabStepsAutoNumbered();
    this.url = url;
    this.lo = lo;
    this.objectivesHtml = convertMd(this.lo.los[0].contentMd, this.url);
    this.lo.los.forEach((chapter) => {
      this.chaptersHtml.set(encodeURI(chapter.shortTitle), convertMd(chapter.contentMd, this.url));
      this.chaptersTitles.set(chapter.shortTitle, removeLeadingHashes(chapter.title));
    });
    this.steps = Array.from(this.chaptersHtml.keys());
  }

  refreshNav() {
    let nav = "";
    this.horizontalNavbarHtml = "";

    this.lo.los.forEach((chapter, i) => {
      let number = this.autoNumber == true ? chapter.shortTitle + ": " : "";
      const active = encodeURI(chapter.shortTitle) == this.currentChapterShortTitle ? "font-bold bordered bg-neutral-focus" : "";
      let title = this.chaptersTitles.get(chapter.shortTitle);
      nav = nav.concat(
          `<li class="py-1 text-base ${active}"> <a href="/#/lab/${this.url}/${encodeURI(chapter.shortTitle)}"> ${number}${title} </a> </li>`
      );

      // horizontal nav
      if (encodeURI(chapter.shortTitle) == this.currentChapterShortTitle) {
        if (this.lo.los[i - 1] !== undefined) {
          let nav = this.lo.los[i - 1];
          let title = this.chaptersTitles.get(nav.shortTitle);
          let step = `${i - 1}:`;
          this.horizontalNavbarHtml = this.horizontalNavbarHtml.concat(
              `<a class="btn btn-sm capitalize" href="/#/lab/${this.url}/${encodeURI(
                  nav.shortTitle
              )}"> <span aria-hidden="true">&larr;</span>&nbsp; ${number}${title} </a>`
          );
        }
        if (this.lo.los[i + 1] !== undefined) {
          let nav = this.lo.los[i + 1];
          let title = this.chaptersTitles.get(nav.shortTitle);
          let step = `${i + 1}:`;
          this.horizontalNavbarHtml = this.horizontalNavbarHtml.concat(
              `<a class="ml-auto btn btn-sm capitalize" style="margin-left: auto" href="/#/lab/${this.url}/${encodeURI(
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
