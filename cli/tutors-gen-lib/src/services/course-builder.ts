import frontMatterModule from "front-matter";
const frontMatter = frontMatterModule.default || frontMatterModule;

import {
  getArchiveFile,
  getFilesWithType,
  getFileWithName,
  getGitLink,
  getId,
  getImage,
  getImageFile,
  getLabImage,
  getLabImageFile,
  getMarkdown,
  getPdf,
  getPdfFile,
  getRoute,
  getVideo,
  getWebLink,
  readVideoIds,
  removeLeadingHashes,
} from "../utils/lr-utils.ts";
import { type Archive, type Composite, type Course, isCompositeLo, type Lab, type Lo, preOrder, type Talk } from "@tutors/tutors-model-lib";
import { readWholeFile, readYamlFile } from "../utils/file-utils.ts";
import type { LearningResource } from "../types/types.ts";

function buildTalk(lo: Lo, lr: LearningResource) {
  const talk = lo as Talk;
  talk.pdf = getPdf(lr);
  talk.pdfFile = getPdfFile(lr);
  if (!talk.pdf) {
    talk.route = lo.video;
  }
}

function buildArchive(lo: Lo, lr: LearningResource) {
  const archive = lo as Archive;
  archive.archiveFile = getArchiveFile(lr);
}

function buildPanelvideo(lo: Lo) {
  lo.route = lo.video;
}

function buildWeb(lo: Lo, lr: LearningResource) {
  lo.route = getWebLink(lr);
}

function buildGithub(lo: Lo, lr: LearningResource) {
  lo.route = getGitLink(lr);
}

function buildLab(lo: Lo, lr: LearningResource): Lo {
  const lab = lo as Lab;
  lab.los = [];
  const mdFiles = getFilesWithType(lr, "md");
  const title = lo.title;
  lo.title = "";
  mdFiles.forEach((chapterName) => {
    const wholeFile = readWholeFile(chapterName);
    const contents = frontMatter(wholeFile);
    let theTitle = contents.body.substring(0, contents.body.indexOf("\n"));
    theTitle = theTitle.replace("\r", "");
    theTitle = removeLeadingHashes(theTitle);
    const shortTitle = chapterName.substring(
      chapterName.indexOf(".") + 1,
      chapterName.lastIndexOf("."),
    );
    if (lab.title == "") lab.title = shortTitle;
    const labStep = {
      title: theTitle,
      shortTitle: shortTitle,
      contentMd: contents.body,
      route: `${getRoute(lr)}/${shortTitle}`,
      id: shortTitle,
      type: "step",
    };
    lab.los.push(labStep);
  });
  lab.img = getLabImage(lr);
  lab.imgFile = `img/${getLabImageFile(lr)}`;
  if (!lab.img) {
    lab.img = getImage(lr);
    lab.imgFile = getImageFile(lr);
    lab.title = title;
    lab.pdf = getPdf(lr);
    lab.pdfFile = getPdfFile(lr);
  }
  return lo;
}

function buildSimpleLo(lo: Lo, lr: LearningResource): Lo {
  switch (lo.type) {
    case "lab":
      buildLab(lo, lr);
      break;
    case "talk":
      buildTalk(lo, lr);
      break;
    case "paneltalk":
      buildTalk(lo, lr);
      break;
    case "panelvideo":
      buildPanelvideo(lo);
      break;
    case "web":
      buildWeb(lo, lr);
      break;
    case "github":
      buildGithub(lo, lr);
      break;
    case "archive":
      buildArchive(lo, lr);
      break;
    default:
  }
  return lo;
}

function buildUnit(lo: Lo) {
  lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
  lo.route = lo.route.replace("/unit", "/topic");
}

function buildSide(lo: Lo) {
  lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
  lo.route = lo.route.replace("/side", "/topic");
}

function buildCompositeLo(lo: Lo, lr: LearningResource, level: number): Lo {
  const compositeLo = lo as Composite;
  compositeLo.los = [];
  switch (compositeLo.type) {
    case "unit":
      buildUnit(compositeLo);
      break;
    case "side":
      buildSide(compositeLo);
      break;
    default:
  }
  lr.lrs.forEach((lr) => {
    const subLo = buildLo(lr, level + 1);
    if (subLo.type !== "unknown") compositeLo.los.push(subLo);
  });
  compositeLo.los.sort((a: Lo, b: Lo) => {
    const aOrder = preOrder.get(a.type) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = preOrder.get(b.type) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
  return lo;
}

function buildDefaultLo(lr: LearningResource, keyFileName: string = ""): Lo {
  const [title, summary, contentMd, frontMatter] = getMarkdown(lr, keyFileName);
  const videoids = readVideoIds(lr);
  const lo: Lo = {
    route: getRoute(lr),
    type: lr.type,
    title: title,
    summary: summary,
    contentMd: contentMd,
    frontMatter: frontMatter,
    id: getId(lr),
    img: getImage(lr),
    imgFile: getImageFile(lr),
    video: getVideo(lr, videoids.videoid),
    videoids: videoids,
    hide: false,
    authLevel: 0,
  };
  return lo;
}

function buildLo(
  lr: LearningResource,
  level: number,
  keyFileName: string = "",
): Lo {
  let lo = buildDefaultLo(lr, keyFileName);
  console.log(`${"-".repeat(level * 2)}: ${lo.id} : ${lo.title}`);
  if (isCompositeLo(lo)) {
    lo = buildCompositeLo(lo, lr, level);
  } else {
    lo = buildSimpleLo(lo, lr);
  }
  return lo;
}

export function buildCourse(lr: LearningResource): Course {
  const course = buildLo(lr, 0, "course.md") as Course;
  course.type = "course";
  course.route = "/";
  const propertiesFile = getFileWithName(lr, "properties.yaml");
  if (propertiesFile) {
    course.properties = readYamlFile(propertiesFile);
    const ignoreList = course.properties?.ignore;
    if (ignoreList) {
      const los = course.los.filter((lo) => ignoreList.indexOf(lo.id) >= 0);
      los.forEach((lo) => {
        if ("type" in lo) lo.hide = true;
      });
    }
  }
  const calendarFile = getFileWithName(lr, "calendar.yaml");
  if (calendarFile) {
    course.calendar = readYamlFile(calendarFile);
  }

  const enrollmentFile = getFileWithName(lr, "enrollment.yaml");
  if (enrollmentFile) {
    course.enrollment = readYamlFile(enrollmentFile);
  }

  return course;
}
