import { LearningObject } from "./lo";
import * as fs from "fs";
import { copyFolder, getDirectories, getImageFile, initPath, readFile, readWholeFile } from "../utils/futils";
import * as path from "path";
import * as sh from "shelljs";
import fm from "front-matter";
import * as glob from "glob";

export class Chapter {
  title = "";
  shortTitle = "";
  contentMd = "";
  content = "";
  route = "";
}

export class Lab extends LearningObject {
  directories: Array<string> = [];
  chapters: Array<Chapter> = [];

  constructor(parent: LearningObject) {
    super(parent);
    this.reap();
    this.link = "index.html";
    this.lotype = "lab";
    if (fs.existsSync("videoid")) {
      this.videoid = readFile("videoid");
    }
  }

  reapChapters(mdFiles: Array<string>): Array<Chapter> {
    const chapters: Array<Chapter> = [];
    mdFiles.forEach((chapterName) => {
      const wholeFile = readWholeFile(chapterName);
      const contents = fm(wholeFile);
      let theTitle = contents.body.substr(0, contents.body.indexOf("\n"));
      theTitle = theTitle.replace("\r", "");
      const chapter = {
        file: chapterName,
        title: theTitle,
        shortTitle: chapterName.substring(chapterName.indexOf(".") + 1, chapterName.lastIndexOf(".")),
        contentMd: contents.body,
        route: "",
        content: "",
      };
      chapters.push(chapter);
    });
    return chapters;
  }

  reap(): void {
    const mdFiles = glob.sync("*.md").sort();
    if (mdFiles.length === 0) {
      return;
    }
    const resourceName = path.parse(mdFiles[0]).name;
    super.reap(resourceName);
    this.directories = getDirectories(".");
    this.chapters = this.reapChapters(mdFiles);
    this.title = this.chapters[0].shortTitle;
    this.img = getImageFile("img/main");
  }

  publish(path: string): void {
    sh.cd(this.folder);
    const labPath = path + "/" + this.folder;
    initPath(labPath);
    this.directories.forEach((directory) => {
      copyFolder(directory, labPath);
    });
    sh.cd("..");
  }
}
