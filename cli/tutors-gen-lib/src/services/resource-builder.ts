import * as fs from "node:fs";
import path from "node:path";
import { copyFileToFolder, findLastMatchingString, getFileName, getFileType } from "../utils/file-utils.ts";
import { assetTypes, loTypes } from "@tutors/tutors-model-lib";
import type { LearningResource } from "../types/types.ts";

const loSignatures: string[] = [];
loTypes.forEach((type) => loSignatures.push(`/${type}`));

let root = "";

export function getLoType(route: string): string {
  let lotype = findLastMatchingString(loSignatures, route, root);
  if (lotype === "book") {
    lotype = "lab";
  } else if (lotype === "") {
    lotype = "unknown";
  }
  return lotype;
}

export function build(dir: string): LearningResource {
  const tree: LearningResource = {
    courseRoot: root,
    route: dir,
    type: getLoType(dir),
    lrs: [],
    files: [],
    id: path.basename(dir),
  };
  const files = fs.readdirSync(dir).sort();
  if (files.length > 0) {
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const stat = fs.statSync(filePath);
      if (
        stat.isDirectory() &&
        !(file.startsWith(".") || file === "json" || file === "html")
      ) {
        tree.lrs.push(build(filePath));
      } else {
        tree.files.push(filePath);
      }
    }
  }
  return tree;
}

export function pruneTree(lr: LearningResource): void {
  lr.lrs.forEach((resource, index) => {
    if (resource.type === "unknown") {
      lr.lrs.splice(index, 1);
    }
    pruneTree(resource);
  });
}

export function buildTree(dir: string): LearningResource {
  root = dir;
  const mainLr = build(dir);
  mainLr.type = "course";
  pruneTree(mainLr);
  return mainLr;
}

export function copyAssetFiles(lr: LearningResource, dest: string): void {
  lr.files.forEach((file) => {
    if (assetTypes.includes(getFileType(file))) {
      const fileName = getFileName(file);
      const filePath = file.replace(lr.courseRoot, "");
      const destPath = `${dest}${filePath.replace(fileName, "")}`;
      copyFileToFolder(file, destPath);
    }
  });
  lr.lrs.forEach((lr) => copyAssetFiles(lr, dest));
}
