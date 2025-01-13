import { Lo, Course, Composite } from "../models/lo-types";
import { flattenLos, removeFirstLine, removeLeadingHashes } from "../models/lo-utils";
import { writeFile } from "./file-utils";

let header = "";

function printLo (lo: Lo, level: number) {
  const title = removeLeadingHashes(lo.title);
  const contentMd = removeFirstLine(lo.contentMd);
  return `${'#'.repeat(level)} ${lo.type.charAt(0).toUpperCase() + lo.type.slice(1)} : ${title}\n\n ${contentMd}`;
}

function generateLo(lo: Lo, llmsTxt: string[], level: number) {
  llmsTxt.push(printLo(lo, level));
  if (lo.hasOwnProperty("los")) {
    const compositeLo = lo as Composite;
    compositeLo.los?.forEach((childLo: Lo) => {
      generateLo(childLo, llmsTxt, level + 1);
    });
  }
}

function generateAll(course: Course, folder: string) {
  const allTxt = [];
  allTxt.push(header);
  allTxt.push(`# ${course.title}\n\n${course.contentMd}`);
  generateLo(course, allTxt, 1);
  return allTxt;
}

function generateNotes(notes: Lo[]): string[] {
  const notesTxt = [];
  notesTxt.push(header);
  notesTxt.push("# All Notes in the course");
  notes.forEach((note) => {
    notesTxt.push(printLo(note, 2));
  });
  return notesTxt;
}

function generateLabs(labs: Lo[]): string[] {
  const labsTxt = [];
  labsTxt.push(header);
  labsTxt.push("# All Labs in the course");
  labs.forEach((lab, index) => {
    labsTxt.push(printLo(lab, 2));
    if (lab.hasOwnProperty("los")) {
      const compositeLo = lab as Composite;
      compositeLo.los?.forEach((step) => {
        labsTxt.push(printLo(step, 3));
      });
    }
  });
  return labsTxt;
}

export function generateLlms(course: Course, folder: string) {
  header = `<SYSTEM> This is the Tutors course ${course.title} by ${course.properties.credits}</SYSTEM>\n\n`;

  const allLos = flattenLos(course.los);
  const labs = allLos.filter((lo) => lo.type === "lab");
  const notes = allLos.filter((lo) => lo.type === "note");

  const allTxt = generateAll(course, folder);
  const notesTxt = generateNotes(notes);
  const labsTxt = generateLabs(labs);

  writeFile(folder, "llms-full.txt", allTxt.join("\n"));
  writeFile(folder, "llms-labs.txt", labsTxt.join("\n"));
  writeFile(folder, "llms-notes.txt", notesTxt.join("\n"));
}
