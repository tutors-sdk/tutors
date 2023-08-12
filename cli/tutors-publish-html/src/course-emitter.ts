import * as sh from "shelljs";
import { Course, Lo } from "tutors-gen-lib/src/lo/lo-types";
import { writeFile } from "tutors-gen-lib/src/utils/file-utils";
import * as nunjucks from "nunjucks";

const root = __dirname;
nunjucks.configure(root + "/views", { autoescape: false });
nunjucks.installJinjaCompat();

function publishTemplate(path: string, file: string, template: string, lo: any): void {
  writeFile(path, file, nunjucks.render(template, { lo: lo }));
}

function emitNote(lo: Lo, path: string) {
  const notePath = `${path}/${lo.id}`;
  publishTemplate(notePath, "index.html", "Note.njk", lo);
}

function emitLab(lo: Lo, path: string) {
  const labPath = `${path}/${lo.id}`;
  publishTemplate(labPath, "index.html", "Lab.njk", lo);
}

function emitLoPage(lo: Lo, path: string) {
  if (lo.type == "lab") {
    emitLab(lo as Lo, path);
  }
  if (lo.type == "note" || lo.type == "panelnote") {
    emitNote(lo as Lo, path);
  }
}

function emitUnit(lo: Lo, path: string) {
  lo.los.forEach((lo) => {
    emitLoPage(lo as Lo, path);
  });
}

function emitLo(lo: Lo, path: string) {
  if (lo.type == "unit" || lo.type == "side") {
    const unitPath = `${path}/${lo.id}`;
    emitUnit(lo, unitPath);
  } else {
    emitLoPage(lo, path);
  }
}

function emitTopic(lo: Lo, path: string) {
  sh.cd(lo.id);
  const topicPath = `${path}/${lo.id}`;
  lo?.los?.forEach((lo) => {
    emitLo(lo as Lo, topicPath);
  });
  publishTemplate(topicPath, "index.html", "Topic.njk", lo);
  sh.cd("..");
}

export function emitWalls(path: string, lo: Course) {
  lo.walls?.forEach((los) => {
    const type = los[0].type;
    lo.los = los;
    lo.breadCrumbs = [];
    lo.breadCrumbs.push(lo);
    if (lo.properties) {
      lo.properties["credits"] = `All ${type}'s in course`;
    }
    publishTemplate(path, `${type}.html`, "Wall.njk", lo);
  });
}

export function emitCourse(path: string, lo: Course) {
  sh.cd(path);
  lo?.los?.forEach((lo) => {
    emitTopic(lo as Lo, path);
  });
  publishTemplate(path, "index.html", "Course.njk", lo);
  emitWalls(path, lo);
}
