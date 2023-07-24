import { convertMdToHtml } from "../utils/markdown-utils";
import type { Lo } from "../types/lo-types";
import type { Course } from "./course";
import { removeLeadingHashes } from "../utils/lo-utils";

function truncate(input: string) {
  if (input?.length > 16) {
    return input.substring(0, 15) + "...";
  }
  return input;
}

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
    this.convertMdToHtml();
  }

  convertMdToHtml() {
    const assetUrl = this.url.replace(`/lab/${this.course.id}`, this.course.url);
    this.objectivesHtml = convertMdToHtml(this.lo.los[0].contentMd, assetUrl);
    this.chaptersHtml = new Map(this.lo.los.map((chapter) => [encodeURI(chapter.shortTitle), convertMdToHtml(chapter.contentMd, assetUrl)]));
    this.chaptersTitles = new Map(this.lo.los.map((chapter) => [chapter.shortTitle, removeLeadingHashes(chapter.title)]));
    this.steps = Array.from(this.chaptersHtml.keys());
  }

  refreshNav() {
    const number = this.autoNumber ? this.lo.shortTitle + ": " : "";

    this.navbarHtml = this.lo.los
      .map((chapter) => {
        const active = encodeURI(chapter.shortTitle) === this.currentChapterShortTitle ? "font-bold bg-surface-200 dark:bg-surface-600 pl-4" : "";
        const title = this.chaptersTitles.get(chapter.shortTitle);
        return `<a href="${this.url}/${encodeURI(chapter.shortTitle)}"><li class="py-2 px-4 ${active} !text-black dark:!text-white">${number}${title}</li></a>`;
      })
      .join("");

    const currentChapterIndex = this.lo.los.findIndex((chapter) => encodeURI(chapter.shortTitle) === this.currentChapterShortTitle);
    if (currentChapterIndex !== -1) {
      const prevChapter = this.lo.los[currentChapterIndex - 1];
      const prevTitle = prevChapter ? truncate(this.chaptersTitles.get(prevChapter.shortTitle)) : "";
      this.horizontalNavbarHtml = prevChapter
        ? `<a class="btn btn-sm capitalize" href="${this.url}/${encodeURI(prevChapter.shortTitle)}"> <span aria-hidden="true">&larr;</span>&nbsp; ${number}${prevTitle} </a>`
        : "";

      const nextChapter = this.lo.los[currentChapterIndex + 1];
      const nextTitle = nextChapter ? truncate(this.chaptersTitles.get(nextChapter.shortTitle)) : "";
      this.horizontalNavbarHtml += nextChapter
        ? `<a class="ml-auto btn btn-sm capitalize" style="margin-left: auto" href="${this.url}/${encodeURI(
            nextChapter.shortTitle
          )}"> ${number}${nextTitle} &nbsp;<span aria-hidden="true">&rarr;</span></a>`
        : "";
    } else {
      this.horizontalNavbarHtml = "";
    }
  }

  setCurrentChapter(step: string) {
    if (!this.steps.includes(step)) return;
    this.currentChapterShortTitle = step;
    this.currentChapterTitle = this.chaptersTitles.get(step);
    this.content = this.chaptersHtml.get(step);
    this.refreshNav();
  }

  setFirstPageActive() {
    const startStep = encodeURI(this.lo.los[0].shortTitle);
    this.setCurrentChapter(startStep);
  }

  setActivePage(step: string) {
    this.setCurrentChapter(step);
  }

  nextStep(): string {
    const itemIndex = this.steps.indexOf(this.currentChapterShortTitle);
    return itemIndex < this.steps.length - 1 ? this.steps[itemIndex + 1] : "";
  }

  prevStep(): string {
    const itemIndex = this.steps.indexOf(this.currentChapterShortTitle);
    return itemIndex > 0 ? this.steps[itemIndex - 1] : "";
  }
}
