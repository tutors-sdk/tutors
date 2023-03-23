import { imageTypes } from "./../builders/lo-types";
import path from "path";
import * as sh from "shelljs";
import fm from "front-matter";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { LearningResource, VideoIdentifier, VideoIdentifiers } from "../builders/lo-types";
import { getFileType, getHeaderFromBody, readFirstLineFromFile, readWholeFile, withoutHeaderFromBody } from "./utils";

export function getFileWithName(lr: LearningResource, file: string) {
  let foundFilePath = "";
  lr.files.forEach((filePath) => {
    const fileName = filePath.replace(/^.*[\\\/]/, "");
    if (fileName === file) {
      foundFilePath = filePath;
    }
  });
  return foundFilePath;
}

export function getRoute(lr: LearningResource): string {
  return `/${lr.type}/{{COURSEURL}}${lr.route.replace(lr.courseRoot, "")}`;
}

export function getFileWithType(lr: LearningResource, types: string[]): string {
  const files = lr.files.filter((file) => types.includes(getFileType(file)));
  if (files.length) {
    return files[0];
  } else {
    return "";
  }
}

export function getFilesWithType(lr: LearningResource, type: string): string[] {
  const files = lr.files.filter((file) => type.includes(getFileType(file)));
  return files;
}

export function getFilesWithTypes(lr: LearningResource, types: string[]): string[] {
  const files = lr.files.filter((file) => types.includes(getFileType(file)));
  return files;
}

export function getId(lr: LearningResource): string {
  return path.basename(lr.route);
}

export function getImage(lr: LearningResource): string {
  let imageFile = getFileWithType(lr, imageTypes);
  if (imageFile) {
    imageFile = `https://{{COURSEURL}}${imageFile.replace(lr.courseRoot, "")}`;
  }
  return imageFile;
}

export function getArchive(lr: LearningResource): string {
  let archiveFile = getFileWithType(lr, ["zip"]);
  if (archiveFile) {
    archiveFile = `https://{{COURSEURL}}${archiveFile.replace(lr.courseRoot, "")}`;
  }
  return archiveFile;
}

export function getWebLink(lr: LearningResource): string {
  const webLinkFile = getFileWithName(lr, "weburl");
  return readFirstLineFromFile(webLinkFile);
}

export function getGitLink(lr: LearningResource): string {
  const webLinkFile = getFileWithName(lr, "githubid");
  return readFirstLineFromFile(webLinkFile);
}

export function getLabImage(lr: LearningResource): string {
  let foundFilePath = "";
  const imageLrs = lr.lrs.filter((lr) => lr.id === "img");
  if (imageLrs.length > 0) {
    const imageFiles = getFilesWithTypes(imageLrs[0], imageTypes);
    imageFiles.forEach((filePath) => {
      if (filePath.includes("/img/main")) {
        foundFilePath = `https://{{COURSEURL}}${filePath.replace(lr.courseRoot, "")}`;
      }
    });
  }
  return foundFilePath;
}

export function getPdf(lr: LearningResource): string {
  let pdfFile = getFileWithType(lr, ["pdf"]);
  if (pdfFile) {
    pdfFile = `https://{{COURSEURL}}${pdfFile.replace(lr.courseRoot, "")}`;
  }
  return pdfFile;
}

export function getVideo(lr: LearningResource, id: string): string {
  let videoId = "";
  if (id) {
    videoId = `/video/{{COURSEURL}}${lr.route.replace(lr.courseRoot, "")}/${id}`;
  }
  return videoId;
}

export function getMarkdown(lr: LearningResource): [string, string, string, any] {
  const mdFile = getFileWithType(lr, ["md"]);
  if (mdFile) {
    const contents = fm(readWholeFile(mdFile));
    const frontMatter = contents.attributes;
    const title = getHeaderFromBody(contents.body);
    const summary = withoutHeaderFromBody(contents.body);
    const contentsMd = contents.body;
    return [title, summary, contentsMd, frontMatter];
  } else {
    return ["", "", "", {}];
  }
}

function parseProperty(nv: string): VideoIdentifier {
  const nameValue = nv.split("=");
  nameValue[0] = nameValue[0].replace("\r", "");
  nameValue[1] = nameValue[1].replace("\r", "");
  return { service: nameValue[0], id: nameValue[1] };
}

export function readVideoIds(lr: LearningResource): VideoIdentifiers {
  const videos: VideoIdentifiers = {
    videoid: "",
    videoIds: [],
  };

  const videoIdFile = getFileWithName(lr, "videoid");
  if (videoIdFile) {
    const entries = fs.readFileSync(videoIdFile).toString().split("\n");

    entries.forEach((entry) => {
      if (entry !== "") {
        if (entry.includes("heanet") || entry.includes("vimp")) {
          videos.videoIds.push(parseProperty(entry));
        } else {
          videos.videoid = entry;
          videos.videoIds.push({ service: "youtube", id: entry });
        }
      }
    });
  }
  if (videos.videoIds.length > 0) {
    videos.videoid = videos.videoIds[videos.videoIds.length - 1].id;
  }
  return videos;
}

export function readYaml(lr: LearningResource): any {
  let yamlData = null;
  const yamlfilePath = getFileWithName(lr, "properties.yaml");
  if (yamlfilePath) {
    try {
      yamlData = yaml.load(fs.readFileSync(yamlfilePath, "utf8"));
    } catch (err: any) {
      console.log(`Tutors encountered an error reading properties.yaml:`);
      console.log("--------------------------------------------------------------");
      console.log(err.mark.buffer);
      console.log("--------------------------------------------------------------");
      console.log(err.message);
      console.log("Review this file and try again....");
      sh.exit(1);
    }
  }
  return yamlData;
}
