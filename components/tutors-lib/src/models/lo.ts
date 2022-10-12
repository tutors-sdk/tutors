import { Properties } from "../utils/properties";
import * as path from "path";
import { getHeaderFromBody, getImageFile, getParentFolder, readWholeFile, readYaml, withoutHeaderFromBody } from "../utils/futils";
import * as fs from "fs";
import { readVideoIds, VideoIdentifiers } from "../utils/videoutils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fm = require("front-matter");

export abstract class LearningObject {
  parent?: LearningObject;
  course?: LearningObject;
  lotype: string;
  title?: string;
  img = "";
  videoid?: string;
  videoids?: VideoIdentifiers;
  link?: string;
  folder = "";
  parentFolder?: string;
  objectivesMd?: string;
  objectives?: string;
  frontMatter?: Properties;
  hide = false;
  properties?: Properties;
  icon?: any;

  protected constructor(parent?: LearningObject) {
    if (parent) {
      this.parent = parent;
    }
    this.lotype = "lo";
  }

  reap(pattern: string): void {
    this.folder = path.basename(process.cwd());
    this.parentFolder = getParentFolder();
    this.img = getImageFile(pattern);
    if (fs.existsSync("properties.yaml")) {
      this.properties = readYaml("properties.yaml");
    }
    if (fs.existsSync(pattern + ".md")) {
      const contents = fm(readWholeFile(pattern + ".md"));
      if (Object.keys(contents.attributes).length > 0) {
        this.frontMatter = contents.attributes;
      }
      this.title = getHeaderFromBody(contents.body);
      this.title = this.title + " ";

      this.objectivesMd = withoutHeaderFromBody(contents.body);
    } else {
      this.title = pattern;
    }
    this.videoids = readVideoIds();
    this.videoid = this.videoids.videoid;
  }

  abstract publish(path: string): void;
}
