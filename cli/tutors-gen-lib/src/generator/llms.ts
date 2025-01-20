import { Lo, Course, Composite, Talk } from "../models/lo-types";
import { flattenLos, removeFirstLine, removeLeadingHashes } from "../models/lo-utils";
import { compressToZip, writeFile } from "./file-utils";

let header = "";

function printLo(lo: Lo, level: number) {
  const title = removeLeadingHashes(lo.title);
  const contentMd = removeFirstLine(lo.contentMd);
  return `${"#".repeat(level)} ${lo.type.charAt(0).toUpperCase() + lo.type.slice(1)} : ${title}\n\n ${contentMd}`;
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

function generatePdfs(pdfs: Talk[], folder: string): string[] {
  const pdfsTxt: string[] = [];
  const pdfFiles: string[] = [];
  for (const pdf of pdfs) {
    let descriptor = `# ${pdf.title} \n ${pdf.summary} \n`;
    const relativeRoute = pdf.route.substring(pdf.route.indexOf("{{COURSEURL}}") + "{{COURSEURL}}".length);
    descriptor += `- [${pdf.title}](https://full-stack-1-2023.netlify.app${relativeRoute}/${pdf.pdfFile})\n\n`;
    pdfFiles.push(`./${relativeRoute}/${pdf.pdfFile}`);
    pdfsTxt.push(descriptor);
  }
  compressToZip(pdfFiles, `${folder}/llms-pdfs.zip`);
  return pdfsTxt;
}

export function generateLlms(course: Course, folder: string) {
  header = `<SYSTEM> This is the Tutors course ${course.title} by ${course.properties.credits}</SYSTEM>\n\n`;

  const allLos = flattenLos(course.los);
  const labs = allLos.filter((lo) => lo.type === "lab");
  const notes = allLos.filter((lo) => lo.type === "note");
  const pdfs = allLos.filter((lo) => lo.type === "talk");
  const videos = allLos.filter((lo) => lo.type === "video" || lo.type === "panelvideo");

  const allTxt = generateAll(course, folder);
  const notesTxt = generateNotes(notes);
  const labsTxt = generateLabs(labs);
  const pdfsTxt = generatePdfs(pdfs as Talk[], folder);

  writeFile(folder, "llms-full.txt", allTxt.join("\n"));
  writeFile(folder, "llms-labs.txt", labsTxt.join("\n"));
  writeFile(folder, "llms-notes.txt", notesTxt.join("\n"));
  writeFile(folder, "llms-pdfs.txt", pdfsTxt.join("\n"));
}
