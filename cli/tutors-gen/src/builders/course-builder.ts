import { getFilesWithType, getFileWithName, getId, getImage, getLabImage, getMarkdown, getPdf, getRoute, getVideo, readVideoIds } from "../utils/lr-utils";
import { LabStep, LearningObject, LearningResource, preOrder } from "./lo-types";
import { readWholeFile, readYamlFile, writeFile } from "../utils/utils";
import fm from "front-matter";

export const courseBuilder = {
  lo: <LearningObject>{},

  buildLo(lr: LearningResource, level: number): LearningObject {
    let lo = this.buildDefaultLo(lr);
    console.log(`${"-".repeat(level * 2)}: ${lo.id} : ${lo.title}`);
    if (lo.type === "lab") {
      lo = this.buildLab(lo, lr);
    } else {
      if (lo.type === "unit") {
        lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
        lo.route = lo.route.replace("/unit", "/topic");
      } else if (lo.type === "side") {
        lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
        lo.route = lo.route.replace("/side", "/topic");
      }
      lr.lrs.forEach((lr) => {
        lo.los.push(this.buildLo(lr, level + 1));
        lo.los.sort((a: any, b: any) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return preOrder.get(a.type)! - preOrder.get(b.type)!;
        });
      });
    }

    return lo;
  },

  buildDefaultLo(lr: LearningResource): LearningObject {
    const [title, summary, contentMd, frontMatter] = getMarkdown(lr);
    const videoids = readVideoIds(lr);
    const lo: LearningObject = {
      route: getRoute(lr),
      type: lr.type,
      title: title,
      summary: summary,
      contentMd: contentMd,
      frontMatter: frontMatter,
      id: getId(lr),
      img: getImage(lr),
      pdf: getPdf(lr),
      video: getVideo(lr, videoids.videoid),
      videoids: videoids,
      los: [],
      hide: false,
    };
    return lo;
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
        route: `${getRoute(lr)}/${shortTitle}`,
        id: shortTitle,
      };
      lo.los.push(labStep);
    });
    lo.img = getLabImage(lr);
    return lo;
  },

  buildCourse(lr: LearningResource) {
    this.lo = this.buildLo(lr, 0);
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

  generateCourse(outputFolder: string) {
    writeFile(outputFolder, "tutors.json", JSON.stringify(this.lo));
  },
};
