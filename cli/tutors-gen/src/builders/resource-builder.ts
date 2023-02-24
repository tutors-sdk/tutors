import * as fs from "fs";
import path from "path";
import { copyFileToFolder, getFileName, getFileType } from "../utils/utils";
import { assetTypes, LearningResource } from "./lo-types";

export const resourceBuilder = {
  lr: <LearningResource>{},
  root: "",

  build(dir: string): LearningResource {
    const tree: LearningResource = { courseRoot: this.root, route: dir, type: "unknown", lrs: [], files: [], id: path.basename(dir) };
    const files = fs.readdirSync(dir);
    if (files.length > 0) {
      for (const file of files) {
        const filePath = `${dir}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          tree.lrs.push(this.build(filePath));
        } else {
          tree.files.push(filePath);
        }
      }
    }
    return tree;
  },

  buildTree(dir: string) {
    this.root = dir;
    this.lr = this.build(dir);
    this.lr.lrs = this.lr.lrs.filter((lr) => lr.route.includes("/topic") || lr.route.includes("/unit"));
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
