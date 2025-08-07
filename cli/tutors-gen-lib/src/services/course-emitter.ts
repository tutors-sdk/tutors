import type { Course, Lab, Lo, Talk, Topic, Unit } from "@tutors/tutors-model-lib";
import { publishTemplate } from "../templates/template-engine.ts";

async function emitTalk(lo: Talk, path: string) {
  const talkPath = `${path}/${lo.id}`;
  await publishTemplate(talkPath, "index.html", "Talk", lo);
}

async function emitNote(lo: Lo, path: string) {
  const notePath = `${path}/${lo.id}`;
  await publishTemplate(notePath, "index.html", "Note", lo);
}

async function emitLab(lo: Lab, path: string) {
  const labPath = `${path}/${lo.id}`;
  for (let index = 0; index < lo.los.length; index++) {
    const step = lo.los[index];
    const nextStep = index < lo.los.length - 1 ? lo.los[index + 1] : null;
    const prevStep = index > 0 ? lo.los[index - 1] : null;
    if (index === 0) {
      await publishTemplate(labPath, "index.html", "Lab", {lab:lo, labStep:step, nextStep:nextStep, prevStep:prevStep});
    } else {
      await publishTemplate(labPath, `${step.shortTitle}.html`, "Lab", {lab:lo, labStep:step, nextStep:nextStep, prevStep:prevStep});
    }
  }
}

async function emitLoPage(lo: Lo, path: string) {
  if (lo.type == "lab") {
    await emitLab(lo as Lab, path);
  }
  if (lo.type == "note" || lo.type == "panelnote") {
    await emitNote(lo as Lo, path);
  }
  if (lo.type == "topic") {
    await emitComposite(lo as Topic, `${path}`);
  }
  if (lo.type == "talk") {
    await emitTalk(lo as Talk, `${path}`);
  }
}

async function emitUnit(lo: Unit, path: string) {
  for (const loItem of lo.los) {
    await emitLoPage(loItem as Lo, path);
  }
}

async function emitLo(lo: Lo, path: string) {
  if (lo.type == "unit" || lo.type == "side") {
    const unitPath = `${path}/${lo.id}`;
    await emitUnit(lo as Unit, unitPath);
  } else {
    await emitLoPage(lo, path);
  }
}

async function emitComposite(lo: Topic, path: string) {
  const topicPath = `${path}/${lo.id}`;
  if (lo.los) {
    for (const loItem of lo.los) {
      await emitLo(loItem as Lo, topicPath);
    }
  }
  await publishTemplate(topicPath, "index.html", "Composite", lo);
}

export async function emitWalls(path: string, lo: Course) {
  if (lo.walls) {
    for (const los of lo.walls) {
      await publishTemplate(path, `${los[0].type}.html`, "Wall", {course: lo, los:los});
    }
  }
}

export async function emitStaticCourse(path: string, lo: Course) {
  if (lo.los) {
    for (const loItem of lo.los) {
      await emitComposite(loItem as Topic, path);
    }
  }
  await publishTemplate(path, "home.html", "Composite", lo);
  await emitWalls(path, lo);
}
