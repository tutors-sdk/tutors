import * as fs from "fs";
import * as sh from "shelljs";
import * as yaml from "js-yaml";

export function writeFile(folder: string, filename: string, contents: string): void {
  if (!fs.existsSync(folder)) {
    sh.mkdir(folder);
  }
  return fs.writeFileSync(folder + "/" + filename, contents);
}

export function findFirstMatchingString(strings: string[], search: string, courseRoot: string): string {
  search = search.replace(courseRoot, "");
  for (const str of strings) {
    if (search.includes(str)) {
      return str.slice(1);
    }
  }
  return "unknown";
}

export function findLastMatchingString(strings: string[], search: string): string {
  for (let index = strings.length - 1; index >= 0; index--) {
    const match = strings[index];
    if (search.includes(match)) {
      return match.slice(1);
    }
  }
  return "unknown";
}

export function getFileName(filePath: string) {
  const fileName = filePath.replace(/^.*[\\\/]/, "");
  return fileName;
}

export function getFileType(fileName: string): string {
  if (fileName.includes(".")) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return fileName.split(".").pop()!;
  } else {
    return "";
  }
}

export function readWholeFile(path: string): string {
  if (fs.existsSync(path)) {
    const array = fs.readFileSync(path).toString();
    return array;
  } else {
    console.log("unable to locate " + path);
  }
  return "";
}

export function readFirstLineFromFile(path: string): string {
  if (fs.existsSync(path)) {
    const array = fs.readFileSync(path).toString().split("\n");
    return array[0].replace("\r", "");
  } else {
    console.log("unable to locate " + path);
  }
  return "";
}

export function getHeaderFromBody(body: string): string {
  let header = "";
  const array = body.split("\n");
  if (array[0][0] === "#") {
    header = array[0].substring(1);
  } else {
    header = array[0];
  }
  return header;
}

export function withoutHeaderFromBody(body: string): string {
  let content = body;
  const line1 = content.indexOf("\n");
  content = content.substring(line1 + 1, content.length);
  content = content.trim();
  const line2 = content.indexOf("\n");
  if (line2 > -1) {
    content = content.substring(0, line2);
  }
  return content;
}

export function copyFolder(src: string, dest: string): void {
  sh.mkdir("-p", dest);
  sh.cp("-rf", src, dest);
}

export function copyFile(src: string, dest: string): void {
  sh.cp(src, dest);
}

export function copyFileToFolder(src: string, dest: string): void {
  if (fs.existsSync(src)) {
    sh.mkdir("-p", dest);
    sh.cp("-rf", src, dest);
  }
}

export function readYamlFile(yamlFilePath: string): any {
  let yamlData = null;
  try {
    yamlData = yaml.load(fs.readFileSync(yamlFilePath, "utf8"));
  } catch (err: any) {
    console.log(`Tutors encountered an error reading ${yamlFilePath}:`);
    console.log("--------------------------------------------------------------");
    console.log(err.mark.buffer);
    console.log("--------------------------------------------------------------");
    console.log(err.message);
    console.log("Review this file and try again....");
    sh.exit(1);
  }
  return yamlData;
}
