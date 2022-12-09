import { LearningObject } from "./lo";
import * as fs from "fs";
import { copyFileToFolder, copyFolder, getDirectories, initPath, readFile, readWholeFile } from "../utils/futils";
import * as sh from "shelljs";
import { Properties } from "../utils/properties";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fm = require("front-matter");

export class Note extends LearningObject {
  directories: Array<string> = [];
  contentMd = "";
  frontMatter?: Properties;

  constructor(parent: LearningObject) {
    super(parent);
    super.reap("note");
    const contents = fm(readWholeFile("note.md"));
    if (Object.keys(contents.attributes).length > 0) {
      this.frontMatter = contents.attributes;
    }
    this.contentMd = contents.body;
    this.link = "index.html";
    this.lotype = "note";
    if (fs.existsSync("videoid")) {
      this.videoid = readFile("videoid");
    }
    this.directories = getDirectories(".");
  }

  publish(path: string): void {
    sh.cd(this.folder);
    const notePath = path + "/" + this.folder;
    initPath(notePath);
    copyFileToFolder(this.img, notePath);
    this.directories.forEach((directory) => {
      copyFolder(directory, notePath);
    });
    sh.cd("..");
  }
}

export class PanelNote extends Note {
  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = "panelnote";
  }
}
