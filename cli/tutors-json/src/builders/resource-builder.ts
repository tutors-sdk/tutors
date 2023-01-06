import * as fs from "fs";
import path from "path";
import { getId } from "../utils/lr-utils";
import { findFirstMatchingString } from "../utils/utils";
import { LearningResource, loTypes } from "./lo-types";

export const resourceBuilder = {
  lr: <LearningResource>{},
  root: "",

  getLoType(route: string): string {
    let lotype = findFirstMatchingString(loTypes, route);
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
    this.lr.lrs = this.lr.lrs.filter((lr) => lr.route.includes("/topic"));
  },
};
