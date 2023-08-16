import {
  getArchive,
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
} from "../lr/lr-utils";
import { Course, Lo, preOrder } from "./lo-types";
import { readWholeFile, readYamlFile } from "../utils/file-utils";
import fm from "front-matter";
import { LearningResource } from "../lr/lr-types";
import { allLos } from "./lo-utils";

function buildCompositeLo(lo: Lo, lr: LearningResource, level: number): Lo {
  switch (lo.type) {
    case "unit":
      buildUnit(lo);
      break;
    case "side":
      buildSide(lo);
      break;
    default:
  }
  lr.lrs.forEach((lr) => {
    lo.los.push(buildLo(lr, level + 1));
    lo.los.sort((a: any, b: any) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return preOrder.get(a.type)! - preOrder.get(b.type)!;
    });
  });
  return lo;
}

function buildSimpleLo(lo: Lo, lr: LearningResource): Lo {
  switch (lo.type) {
    case "lab":
      lo = buildLab(lo, lr);
      break;
    case "talk":
      buildTalk(lo);
      break;
    case "panelvideo":
      buildPanelvideo(lo);
      break;
    case "web":
      lo.route = getWebLink(lr);
      break;
    case "github":
      lo.route = getGitLink(lr);
      break;
    case "archive":
      lo.route = getArchive(lr);
      lo.archiveFile = getArchiveFile(lr);
      break;
    default:
  }
  return lo;
}

function buildLo(lr: LearningResource, level: number, keyFileName: string = ""): Lo {
  let lo = buildDefaultLo(lr, keyFileName);
  console.log(`${"-".repeat(level * 2)}: ${lo.id} : ${lo.title}`);
  if (lo.type === "unit" || lo.type == "side" || lo.type == "topic" || lo.type == "course") {
    lo = buildCompositeLo(lo, lr, level);
  } else {
    lo = buildSimpleLo(lo, lr);
  }
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
    pdf: getPdf(lr),
    pdfFile: getPdfFile(lr),
    video: getVideo(lr, videoids.videoid),
    videoids: videoids,
    los: [],
    hide: false,
    parentLo: undefined,
  };
  return lo;
}

function buildUnit(lo: Lo) {
  lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
  lo.route = lo.route.replace("/unit", "/topic");
}

function buildTalk(lo: Lo) {
  if (!lo.pdf) {
    lo.route = lo.video;
  }
}

function buildSide(lo: Lo) {
  lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
  lo.route = lo.route.replace("/side", "/topic");
}

function buildPanelvideo(lo: Lo) {
  lo.route = lo.video;
}

function buildLab(lo: Lo, lr: LearningResource): Lo {
  const mdFiles = getFilesWithType(lr, "md");
  lo.title = "";
  mdFiles.forEach((chapterName) => {
    const wholeFile = readWholeFile(chapterName);
    const contents = fm(wholeFile);
    let theTitle = contents.body.substring(0, contents.body.indexOf("\n"));
    theTitle = theTitle.replace("\r", "");
    theTitle = removeLeadingHashes(theTitle);
    const shortTitle = chapterName.substring(chapterName.indexOf(".") + 1, chapterName.lastIndexOf("."));
    if (lo.title == "") lo.title = shortTitle;
    const labStep = {
      title: theTitle,
      shortTitle: shortTitle,
      contentMd: contents.body,
      route: `${getRoute(lr)}/${shortTitle}`,
      id: shortTitle,
      type: "step",
    };
    // @ts-ignore
    lo.los.push(labStep);
  });
  lo.img = getLabImage(lr);
  lo.imgFile = `img/${getLabImageFile(lr)}`;
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

  return course;
}
