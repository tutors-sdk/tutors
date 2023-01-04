import { copyFolder } from "tutors-lib/src/utils/futils";
import { getId, getImage, getMarkdown, getPdf, getRoute, getVideo, readVideoIds, readYaml } from "../utils/lr-utils";
import { LearningObject, LearningResource } from "./lo-types";
import { copyFileToFolder, writeFile } from "../utils/utils";

export const courseBuilder = {
  lo: <LearningObject>{},

  buildLo(lr: LearningResource): LearningObject {
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
      properties: readYaml(lr),
    };
    lr.lrs.forEach((lr) => {
      lo.los.push(this.buildLo(lr));
    });
    return lo;
  },

  buildCourse(lr: LearningResource) {
    this.lo = this.buildLo(lr);
    this.lo.type = "course";
    this.lo.route = "/";
  },

  generateCourse(folder: string) {
    copyFileToFolder("course.png", "json");
    this.lo.los.forEach((lo) => copyFolder(lo.id, "json"));
    writeFile(process.cwd(), `${folder}/tutors.json`, JSON.stringify(this.lo));
  },
};
