import type { Lab } from "./lo-types";
import type { Course } from "./lo-types";
import { removeLeadingHashes } from "./lo-utils";

function getKeyIndex(map: Map<string, string>, targetKey: string) {
  const keysArray = [...map.keys()];
  const index = keysArray.indexOf(targetKey);
  return index;
}

function truncate(input: string) {
  if (input?.length > 24) {
    return input.substring(0, 20) + "...";
  }
  return input;
}

export class LiveLab {
  course: Course;
  lab: Lab;
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
  index = 0;
  autoNumber = false;

  vertical = true;

  constructor(course: Course, lo: Lab, labId: string) {
    this.course = course;
    this.autoNumber = course.areLabStepsAutoNumbered;
    this.url = labId;
    this.lab = lo;
    this.convertMdToHtml();
  }

  convertMdToHtml() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.chaptersHtml = new Map(this.lab.los.map((chapter) => [encodeURI(chapter.shortTitle), chapter.contentHtml]));
    this.chaptersTitles = new Map(
      this.lab.los.map((chapter) => [chapter.shortTitle, removeLeadingHashes(chapter.title)])
    );
    this.steps = Array.from(this.chaptersHtml.keys());
  }

  refreshStep() {
    this.content = this.chaptersHtml.get(this.currentChapterShortTitle)!;
  }
  refreshNav() {
    //const number = this.autoNumber ? this.lab.shortTitle + ": " : "";

    this.navbarHtml = this.lab.los
      .map((chapter) => {
        const number = this.autoNumber ? chapter.shortTitle + ": " : "";
        const active =
          encodeURI(chapter.shortTitle) === this.currentChapterShortTitle
            ? "font-bold bg-surface-200 dark:bg-surface-600 pl-4"
            : "";
        const title = this.chaptersTitles.get(chapter.shortTitle);
        return `<a href="${this.url}/${encodeURI(chapter.shortTitle)}"><li class="py-2 px-4 ${active} !text-black dark:!text-white">${number}${title}</li></a>`;
      })
      .join("");

    const currentChapterIndex = this.lab.los.findIndex(
      (chapter) => encodeURI(chapter.shortTitle) === this.currentChapterShortTitle
    );
    if (currentChapterIndex !== -1) {
      let number = "";
      const prevChapter = this.lab.los[currentChapterIndex - 1];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const prevTitle = prevChapter ? truncate(this.chaptersTitles.get(prevChapter.shortTitle)) : "";
      if (prevTitle) number = this.autoNumber ? prevChapter.shortTitle + ": " : "";
      this.horizontalNavbarHtml = prevChapter
        ? `<a class="btn btn-sm text-base capitalize" href="${this.url}/${encodeURI(prevChapter.shortTitle)}"> <span aria-hidden="true">&larr;</span>&nbsp; ${number}${prevTitle} </a>`
        : "";

      number = "";
      const nextChapter = this.lab.los[currentChapterIndex + 1];
      if (nextChapter) number = this.autoNumber ? nextChapter.shortTitle + ": " : "";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const nextTitle = nextChapter ? truncate(this.chaptersTitles.get(nextChapter.shortTitle)) : "";
      this.horizontalNavbarHtml += nextChapter
        ? `<a class="ml-auto btn btn-sm capitalize text-base" style="margin-left: auto" href="${this.url}/${encodeURI(
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
    this.currentChapterTitle = this.chaptersTitles.get(step)!;
    this.content = this.chaptersHtml.get(step)!;
    this.index = getKeyIndex(this.chaptersHtml, step);
    this.refreshNav();
  }

  setFirstPageActive() {
    const startStep = encodeURI(this.lab.los[0].shortTitle);
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
