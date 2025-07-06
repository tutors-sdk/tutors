import shelljs from "npm:shelljs@^0";
import type { Course, Lab, Lo, Talk, Topic, Unit } from "@tutors/tutors-model-lib";
import { fixWallRoutes } from "../templates/utils.ts";
import { publishTemplate } from "../templates/template-engine.ts";

function emitTalk(lo: Talk, path: string) {
  const talkPath = `${path}/${lo.id}`;
  publishTemplate(talkPath, "index.html", "Talk", lo);
}

function emitNote(lo: Lo, path: string) {
  const notePath = `${path}/${lo.id}`;
  publishTemplate(notePath, "index.html", "Note", lo);
}

function emitLab(lo: Lab, path: string) {
  const labPath = `${path}/${lo.id}`;
  lo.los.forEach((step, index) => {
    const nextStep = index < lo.los.length - 1 ? lo.los[index + 1] : null;
    const prevStep = index > 0 ? lo.los[index - 1] : null;
    if (index === 0) {
      publishTemplate(labPath, "index.html", "Lab", {lab:lo, labStep:step, nextStep:nextStep, prevStep:prevStep});
    } else {
      publishTemplate(labPath, `${step.shortTitle}.html`, "Lab", {lab:lo, labStep:step, nextStep:nextStep, prevStep:prevStep});
    }
  });
}

function emitLoPage(lo: Lo, path: string) {
  if (lo.type == "lab") {
    emitLab(lo as Lab, path);
  }
  if (lo.type == "note" || lo.type == "panelnote") {
    emitNote(lo as Lo, path);
  }
  if (lo.type == "topic") {
    emitComposite(lo as Topic, `${path}`);
  }
  if (lo.type == "talk") {
    emitTalk(lo as Talk, `${path}`);
  }
}

function emitUnit(lo: Unit, path: string) {
  lo.los.forEach((lo) => {
    emitLoPage(lo as Lo, path);
  });
}

function emitLo(lo: Lo, path: string) {
  if (lo.type == "unit" || lo.type == "side") {
    const unitPath = `${path}/${lo.id}`;
    emitUnit(lo as Unit, unitPath);
  } else {
    emitLoPage(lo, path);
  }
}

function emitComposite(lo: Topic, path: string) {
  shelljs.cd(lo.id);
  const topicPath = `${path}/${lo.id}`;
  lo?.los?.forEach((lo) => {
    emitLo(lo as Lo, topicPath);
  });
  publishTemplate(topicPath, "index.html", "Composite", lo);
  shelljs.cd("..");
}

export function emitWalls(path: string, lo: Course) {
  lo.walls?.forEach((los) => {
    fixWallRoutes(los);
    publishTemplate(path, `${los[0].type}.html`, "Wall", {course: lo, los:los});
  });
}

export function emitStaticCourse(path: string, lo: Course) {
  shelljs.cd(path);
  lo?.los?.forEach((lo) => {
    emitComposite(lo as Topic, path);
  });
  publishTemplate(path, "home.html", "Course", lo);
  emitWalls(path, lo);
}
