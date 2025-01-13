import { Lo, Course, Composite } from "../models/lo-types";
import { flattenLos } from "../models/lo-utils";
import { writeFile } from "./file-utils";

let header = "";

function generateLo(lo: Lo, llmsTxt: string[], level: number) {
  llmsTxt.push(`${lo.title}\n\n${lo.contentMd}`);
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
    notesTxt.push(`${note.title}\n\n${note.contentMd}`);
  });
  return notesTxt;
}

function generateLabs(labs: Lo[]): string[] {
  const labsTxt = [];
  labsTxt.push(header);
  labsTxt.push("# All Labs in the course");
  labs.forEach((lab) => {
    labsTxt.push(`${lab.title}\n\n${lab.contentMd}`);
    if (lab.hasOwnProperty("los")) {
      const compositeLo = lab as Composite;
      compositeLo.los?.forEach((step) => {
        labsTxt.push(`${step.title}\n\n${step.contentMd}`);
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
