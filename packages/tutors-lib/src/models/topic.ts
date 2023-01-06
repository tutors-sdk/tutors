import { LearningObject } from "./lo";
import { publishLos, reapLos } from "../utils/loutils";
import * as fs from "fs";
import * as sh from "shelljs";
import { copyFileToFolder } from "../utils/futils";

export class Topic extends LearningObject {
  los: Array<LearningObject> = [];
  units: Array<LearningObject>;
  panelVideos: Array<LearningObject>;
  panelTalks: Array<LearningObject>;
  panelNotes: Array<LearningObject>;
  standardLos: Array<LearningObject>;
  allLos: LearningObject[] = [];

  constructor(parent: LearningObject) {
    super(parent);
    this.los = reapLos({ parent: this });
    this.reap("topic");
    this.link = "index.html";
    this.lotype = "topic";
    this.setDefaultImage();

    this.los.forEach((lo) => this.allLos.push(lo));

    this.units = this.los.filter((lo) => lo.lotype == "unit");
    this.panelVideos = this.los.filter((lo) => lo.lotype == "panelvideo");
    this.panelTalks = this.los.filter((lo) => lo.lotype == "paneltalk");
    this.panelNotes = this.los.filter((lo) => lo.lotype == "panelnote");
    this.standardLos = this.los.filter((lo) => lo.lotype !== "unit" && lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk" && lo.lotype !== "panelnote");
  }

  setDefaultImage(): void {
    if (!this.img && this.los.length > 0) {
      const img = `${this.los[0].folder}/${this.los[0].img}`;
      if (fs.existsSync(img)) {
        this.img = img;
      }
    }
  }

  publish(path: string): void {
    console.log("::", this.title);
    sh.cd(this.folder);
    const topicPath = `${path}/${this.folder}`;
    copyFileToFolder(this.img, topicPath);
    publishLos(topicPath, this.los);
    sh.cd("..");
  }
}

export class Unit extends Topic {
  standardLos: Array<LearningObject> = [];

  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = "unit";
    this.standardLos = this.los.filter((lo) => lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk" && lo.lotype !== "panelnote");
  }
}
