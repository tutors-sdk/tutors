import { Lo, Lab, Course, isCompositeLo, Composite } from "../models/lo-types";
import { writeFile } from "./file-utils";


function generateLoLlms (lo: Lo, llmsFullTxt: string[]) {
  llmsFullTxt.push (`${lo.type}: ${lo.title}\n\n${lo.contentMd}`);
  if (isCompositeLo(lo)) {
    const compositeLo = lo as Composite;
    compositeLo.los?.forEach((childLo:Lo) => {
      generateLoLlms(childLo, llmsFullTxt);
    });
  }
}

export function generateLlms(course: Course, folder: string) {

  const llmsFullTxt : string[] = [];
  llmsFullTxt.push (`<SYSTEM> This is the Tutors course ${course.title} by ${course.properties.credits}</SYSTEM>`);

  llmsFullTxt.push (`# ${course.title}\n\n${course.contentMd}`);
 
  generateLoLlms(course, llmsFullTxt);

  writeFile(folder, "llms-full.txt", llmsFullTxt.join("\n"));
}