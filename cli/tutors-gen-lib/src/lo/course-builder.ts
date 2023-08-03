import {
  getArchive,
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
} from "./lr-utils";
import { LabStep, LearningObject, LearningResource, preOrder } from "./lo-types";
import { readWholeFile, readYamlFile, writeFile } from "../utils/utils";
import fm from "front-matter";

export const courseBuilder = {
  lo: <LearningObject>{},

  buildCompositeLo(lo: LearningObject, lr: LearningResource, level: number): LearningObject {
    switch (lo.type) {
      case "unit":
        this.buildUnit(lo);
        break;
      case "side":
        this.buildSide(lo);
        break;
      default:
    }
    lr.lrs.forEach((lr) => {
      lo.los.push(this.buildLo(lr, level + 1));
      lo.los.sort((a: any, b: any) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return preOrder.get(a.type)! - preOrder.get(b.type)!;
      });
    });
    return lo;
  },

  buildSimpleLo(lo: LearningObject, lr: LearningResource): LearningObject {
    switch (lo.type) {
      case "lab":
        lo = this.buildLab(lo, lr);
        break;
      case "talk":
        this.buildTalk(lo);
        break;
      case "panelvideo":
        this.buildPanelvideo(lo);
        break;
      case "web":
        lo.route = getWebLink(lr);
        break;
      case "github":
        lo.route = getGitLink(lr);
        break;
      case "archive":
        lo.route = getArchive(lr);
        break;
      default:
    }
    return lo;
  },

  buildLo(lr: LearningResource, level: number, keyFileName: string = ""): LearningObject {
    let lo = this.buildDefaultLo(lr, keyFileName);
    console.log(`${"-".repeat(level * 2)}: ${lo.id} : ${lo.title}`);
    if (lo.type === "unit" || lo.type == "side" || lo.type == "topic" || lo.type == "course") {
      lo = this.buildCompositeLo(lo, lr, level);
    } else {
      lo = this.buildSimpleLo(lo, lr);
    }
    return lo;
  },

  buildDefaultLo(lr: LearningResource, keyFileName: string = ""): LearningObject {
    const [title, summary, contentMd, frontMatter] = getMarkdown(lr, keyFileName);
    const videoids = readVideoIds(lr);
    const lo: LearningObject = {
      route: getRoute(lr),
      type: lr.type,
      title: title,
      summary: summary,
      contentMd: contentMd,
      contentHtml: "",
      frontMatter: frontMatter,
      icon: { type: "", color: "" },
      id: getId(lr),
      img: getImage(lr),
      imgFile: getImageFile(lr),
      pdf: getPdf(lr),
      pdfFile: getPdfFile(lr),
      video: getVideo(lr, videoids.videoid),
      videoids: videoids,
      los: [],
      hide: false,
      parentLo: undefined
    };
    return lo;
  },

  buildUnit(lo: LearningObject) {
    lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
    lo.route = lo.route.replace("/unit", "/topic");
  },

  buildTalk(lo: LearningObject) {
    if (!lo.pdf) {
      lo.route = lo.video;
    }
  },

  buildSide(lo: LearningObject) {
    lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
    lo.route = lo.route.replace("/side", "/topic");
  },

  buildPanelvideo(lo: LearningObject) {
    lo.route = lo.video;
  },

  buildLab(lo: LearningObject, lr: LearningResource): LearningObject {
    const mdFiles = getFilesWithType(lr, "md");
    lo.title = "";
    mdFiles.forEach((chapterName) => {
      const wholeFile = readWholeFile(chapterName);
      const contents = fm(wholeFile);
      let theTitle = contents.body.substring(0, contents.body.indexOf("\n"));
      theTitle = theTitle.replace("\r", "");
      const shortTitle = chapterName.substring(chapterName.indexOf(".") + 1, chapterName.lastIndexOf("."));
      if (lo.title == "") lo.title = shortTitle;
      const labStep: LabStep = {
        title: theTitle,
        shortTitle: shortTitle,
        contentMd: contents.body,
        contentHtml: "",
        route: `${getRoute(lr)}/${shortTitle}`,
        id: shortTitle,
        type: "step",
        hide: false
      };
      lo.los.push(labStep);
    });
    lo.img = getLabImage(lr);
    lo.imgFile = `img/${getLabImageFile(lr)}`;
    return lo;
  },

  buildCourse(lr: LearningResource) {
    this.lo = this.buildLo(lr, 0, "course.md");
    this.lo.type = "course";
    this.lo.route = "/";
    const propertiesFile = getFileWithName(lr, "properties.yaml");
    if (propertiesFile) {
      this.lo.properties = readYamlFile(propertiesFile);
      const ignoreList = this.lo.properties?.ignore;
      if (ignoreList) {
        const los = this.lo.los.filter((lo) => ignoreList.indexOf(lo.id) >= 0);
        los.forEach((lo) => {
          if ("type" in lo) lo.hide = true;
        });
      }
    }
    const calendarFile = getFileWithName(lr, "calendar.yaml");
    if (calendarFile) {
      this.lo.calendar = readYamlFile(calendarFile);
    }
  },
};
