import { LearningObject } from "./lo";
import { readFile } from "../utils/futils";
import { copyResource } from "../utils/loutils";

export abstract class WebLearningObject extends LearningObject {
  protected constructor(parent: LearningObject, resourceId: string) {
    super(parent);
    this.link = readFile(resourceId);
  }
}

export class Video extends WebLearningObject {
  constructor(parent: LearningObject) {
    super(parent, "videoid");
    super.reap("video");
    this.lotype = "video";
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}

export class PanelVideo extends WebLearningObject {
  constructor(parent: LearningObject) {
    super(parent, "videoid");
    super.reap("panelvideo");
    this.lotype = "panelvideo";
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}

export class Git extends WebLearningObject {
  githubid?: string;

  constructor(parent: LearningObject) {
    super(parent, "githubid");
    super.reap("github");
    this.lotype = "github";
    this.videoid = "none";
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}

export class Web extends WebLearningObject {
  weburl?: string;

  constructor(parent: LearningObject) {
    super(parent, "weburl");
    super.reap("web");
    this.lotype = "web";
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}
