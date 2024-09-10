import * as fs from "fs";
import path from "path";
import { copyFileToFolder, findFirstMatchingString, findLastMatchingString, getFileName, getFileType } from "./file-utils";
import { assetTypes, LearningResource, loTypes } from "../models/lo-types";

const loSignatures: string[] = [];
loTypes.forEach((type) => loSignatures.push(`/${type}`));

export const resourceBuilder = {
  lr: <LearningResource>{},
  root: "",

  getLoType(route: string): string {
    let lotype2 = findFirstMatchingString(loSignatures, route, this.root);
    console.log(route);
    console.log("left to right: " + lotype2);
    let lotype = findLastMatchingString(loSignatures, route, this.root);
    console.log("right to Left: " + lotype);
    if (lotype == "book") {
      lotype = "lab";
    } else if (lotype == "") {
      lotype = "unknown";
    }
    return lotype;
  },

  build(dir: string): LearningResource {
    const tree: LearningResource = { courseRoot: this.root, route: dir, type: this.getLoType(dir), lrs: [], files: [], id: path.basename(dir) };
    const files = fs.readdirSync(dir);
    if (files.length > 0) {
      for (const file of files) {
        const filePath = `${dir}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !(file.startsWith(".") || file === "json" || file === "html")) {
          tree.lrs.push(this.build(filePath));
        } else {
          tree.files.push(filePath);
        }
      }
    }
    return tree;
  },

  pruneTree(lr: LearningResource) {
    lr.lrs.forEach((resource, index) => {
      if (resource.type === "unknown") {
        lr.lrs.splice(index, 1);
      }
      this.pruneTree(resource);
    });
  },

  buildTree(dir: string) {
    this.root = dir;
    this.lr = this.build(dir);
    this.lr.type = "course";
    this.pruneTree(this.lr);
  },

  copyAssetFiles(lr: LearningResource, dest: string) {
    lr.files.forEach((file) => {
      if (assetTypes.includes(getFileType(file))) {
        const fileName = getFileName(file);
        const filePath = file.replace(lr.courseRoot, "");
        const destPath = `${dest}${filePath.replace(fileName, "")}`;
        copyFileToFolder(file, destPath);
      }
    });
    lr.lrs.forEach((lr) => this.copyAssetFiles(lr, dest));
  },

  copyAssets(dest: string) {
    this.copyAssetFiles(this.lr, dest);
  },
};
