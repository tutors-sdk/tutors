import { getFilesWithType, getFileWithName, getId, getImage, getLabImage, getMarkdown, getPdf, getRoute, getVideo, readVideoIds } from "../utils/lr-utils";
import { LearningObject, LearningResource, preOrder } from "./lo-types";
import { copyFileToFolder, copyFolder, readWholeFile, readYamlFile, writeFile } from "../utils/utils";
import fm from "front-matter";

export const courseBuilder = {
  lo: <LearningObject>{},

  buildLo(lr: LearningResource, level: number): LearningObject {
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

    if (lo.type === "lab") {
      lo.los = this.buildLab(lr);
      lo.img = getLabImage(lr);
    }
    if (lo.type === "unit") {
      lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
      lo.route = lo.route.replace("/unit", "/topic");
    }
    lr.lrs.forEach((lr) => {
      lo.los.push(this.buildLo(lr, level + 1));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lo.los.sort((a, b) => preOrder.get(a.type)! - preOrder.get(b.type)!);
    });

    return lo;
  },

  buildLab(lr: LearningResource): LearningObject[] {
    const los: any = [];
    const mdFiles = getFilesWithType(lr, "md");
    mdFiles.forEach((chapterName) => {
      const wholeFile = readWholeFile(chapterName);
      const contents = fm(wholeFile);
      let theTitle = contents.body.substr(0, contents.body.indexOf("\n"));
      theTitle = theTitle.replace("\r", "");
      const shortTitle = chapterName.substring(chapterName.indexOf(".") + 1, chapterName.lastIndexOf("."));
      const lo = {
        title: theTitle,
        shortTitle: shortTitle,
        contentMd: contents.body,
        route: `${getRoute(lr)}/${shortTitle}`,
        type: "labstep",
      };
      los.push(lo);
    });
    return los;
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
          lo.hide = true;
        });
      }
    }
    const calendarFile = getFileWithName(lr, "calendar.yaml");
    if (calendarFile) {
      this.lo.calendar = readYamlFile(calendarFile);
    }
  },

  log(lo: LearningObject, level: number) {
    console.log(`${" ".repeat(level * 2)}${lo.id} : ${lo.title}`);
    lo.los?.forEach((lo) => {
      if (lo.type !== "labstep") {
        this.log(lo, level + 1);
      }
    });
  },

  generateCourse(folder: string) {
    copyFileToFolder("course.png", "json");
    this.lo.los.forEach((lo) => copyFolder(lo.id, "json"));
    writeFile(process.cwd(), `${folder}/tutors.json`, JSON.stringify(this.lo));
    this.log(this.lo, 1);
  },
};
