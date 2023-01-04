import * as fs from "fs";
import { findFirstMatchingString } from "../utils/utils";
import { LearningResource } from "./lo-types";

export const resourceBuilder = {
  loTypes: ["/note", "/book", "/archive", "/web", "/github", "/panelnote", "/paneltalk", "/panelvideo", "/talk", "/unit", "/topic"],
  lr: <LearningResource>{},
  root: "",

  getLoType(route: string): string {
    let lotype = findFirstMatchingString(this.loTypes, route);
    if (lotype == "book") {
      lotype = "lab";
    } else if (lotype == "panelvideo") {
      lotype = "video";
    }
    return lotype;
  },

  build(dir: string): LearningResource {
    const tree: LearningResource = { courseRoot: this.root, route: dir, type: this.getLoType(dir), lrs: [], files: [] };
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
