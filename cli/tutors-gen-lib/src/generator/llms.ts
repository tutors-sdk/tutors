import { Lo, Course, Composite, Talk, Topic } from "../models/lo-types";
import { flattenLos, removeFirstLine, removeLeadingHashes } from "../models/lo-utils";
import { compressToZip, writeFile } from "./file-utils";

let header = "";

export function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
}

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

function generateAll(course: Course) {
  const allTxt = [];
  allTxt.push(header);
  allTxt.push(`# ${course.title}\n\n${course.contentMd}`);
  generateLo(course, allTxt, 1);
  return allTxt;
}

function generatePdfs(pdfs: Talk[], folder: string) {
  let pdfFiles: string[] = [];
  for (const pdf of pdfs) {
    const relativeRoute = pdf.route.substring(pdf.route.indexOf("{{COURSEURL}}") + "{{COURSEURL}}".length);
    pdfFiles.push(`./${relativeRoute}/${pdf.pdfFile}`);
  }
  compressToZip(pdfFiles, folder);
}

export function generateLlmsByTopic(course: Course, folder: string) {
  course.los.forEach((lo: Lo, index) => {
    if (lo.type === "topic" && lo.hide !== true) {
      const topic = lo as Topic;
      let allTxt: string[] = [];
      header = `<SYSTEM> This is the Tutors course ${course.title} topic ${topic.title} by ${course.properties.credits}</SYSTEM>\n\n`;
      allTxt.push(header);
      generateLo(topic, allTxt, 1);

      const paddedIndex = index.toString().padStart(2, "0");
      const title = `${paddedIndex}-${toSnakeCase(topic.title)}`;


      writeFile(folder, `${title}-llms.txt`, allTxt.join("\n"));

      const allLos = flattenLos(topic.los);
      const talks = allLos.filter((lo) => lo.type === "talk");
      generatePdfs(talks as Talk[], `${folder}/${title}-pdfs.zip`);
    }
  });
}

export function generateLlms(course: Course, folder: string) {
  const llmFolder = `${folder}/llms`;
  header = `<SYSTEM> This is the Tutors course ${course.title} by ${course.properties.credits}</SYSTEM>\n\n`;

  const allLos = flattenLos(course.los);
  const pdfs = allLos.filter((lo) => lo.type === "talk");
  const fileName = toSnakeCase(course.title);

  const completeTxt = generateAll(course);
  generatePdfs(pdfs as Talk[], `${llmFolder}/${fileName}-complete-pdfs.zip`);
  writeFile(llmFolder, `${fileName}-complete-llms.txt`, completeTxt.join("\n"));

  generateLlmsByTopic(course, `${llmFolder}/topics`);
}
