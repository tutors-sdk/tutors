import * as fs from "fs";
import * as sh from "shelljs";
import { Archive, PanelTalk, Talk } from "../models/los";
import { LearningObject } from "../models/lo";
import { Course } from "../models/course";
import { Lab } from "../models/lab";
import { Topic, Unit } from "../models/topic";
import { Git, PanelVideo, Video, Web } from "../models/web-los";
import { Note, PanelNote } from "../models/note";

import glob from "glob";

export function reapLos({ parent }: { parent: LearningObject }): Array<LearningObject> {
  let los: Array<LearningObject> = reapLoType("course*", parent, () => {
    return new Course(parent);
  });
  los = los.concat(
    reapLoType("topic*", parent, (parent) => {
      return new Topic(parent);
    })
  );
  los = los.concat(
    reapLoType("unit*", parent, (parent) => {
      return new Unit(parent);
    })
  );
  los = los.concat(
    reapLoType("talk*", parent, (parent) => {
      return new Talk(parent);
    })
  );
  los = los.concat(
    reapLoType("book*", parent, (parent) => {
      return new Lab(parent);
    })
  );
  los = los.concat(
    reapLoType("video*", parent, (parent) => {
      return new Video(parent);
    })
  );
  los = los.concat(
    reapLoType("panelvideo*", parent, (parent) => {
      return new PanelVideo(parent);
    })
  );
  los = los.concat(
    reapLoType("paneltalk*", parent, (parent) => {
      return new PanelTalk(parent);
    })
  );
  los = los.concat(
    reapLoType("archive*", parent, (parent) => {
      return new Archive(parent);
    })
  );
  los = los.concat(
    reapLoType("github*", parent, (parent) => {
      return new Git(parent);
    })
  );
  los = los.concat(
    reapLoType("web*", parent, (parent) => {
      return new Web(parent);
    })
  );
  los = los.concat(
    reapLoType("note*", parent, (parent) => {
      return new Note(parent);
    })
  );
  los = los.concat(
    reapLoType("panelnote*", parent, (parent) => {
      return new PanelNote(parent);
    })
  );
  return los;
}

function reapLoType(pattern: string, parent: LearningObject, locreator: (parent: LearningObject) => LearningObject): Array<LearningObject> {
  const los: Array<LearningObject> = [];
  const folders = glob.sync(pattern).sort();
  for (const folder of folders) {
    if (fs.lstatSync(folder).isDirectory()) {
      sh.cd(folder);
      const lo = locreator(parent);
      los.push(lo);
      sh.cd("..");
    }
  }
  return los;
}

export function findTopLos(los: Array<LearningObject>, lotype: string): LearningObject[] {
  const result: LearningObject[] = [];
  los.forEach((lo) => {
    if (lo.lotype === lotype) {
      result.push(lo);
    }
  });
  return result;
}

export function findLos(los: Array<LearningObject>, lotype: string): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach((lo) => {
    if (lo.lotype === lotype) {
      result.push(lo);
    } else if (lo instanceof Topic) {
      result = result.concat(findLos(lo.los, lotype));
    } else if (lo instanceof Unit) {
      result = result.concat(findLos(lo.los, lotype));
    }
  });
  return result;
}

export function findTalksWithVideos(los: Array<LearningObject>): LearningObject[] {
  let result: LearningObject[] = [];
  los.forEach((lo) => {
    if (lo.lotype === "talk") {
      const talk = lo as Talk;
      if (talk.videoid !== "none") {
        result.push(lo);
      }
    }
    if (lo instanceof Topic) {
      result = result.concat(findTalksWithVideos(lo.los));
    }
  });
  return result;
}

export function publishLos(path: string, los: Array<LearningObject>): void {
  los.forEach((lo) => {
    console.log(`  --> ${lo.title}(${lo.lotype})`);
    lo.publish(path);
  });
}

export function copyResource(src: string, dest: string): void {
  dest = dest + "/" + src;
  sh.mkdir("-p", dest);
  sh.cp("-rf", src + "/*.pdf", dest);
  sh.cp("-rf", src + "/*.zip", dest);
  sh.cp("-rf", src + "/*.png", dest);
  sh.cp("-rf", src + "/*.jpg", dest);
  sh.cp("-rf", src + "/*.jpeg", dest);
  sh.cp("-rf", src + "/*.gif", dest);
}

export function sortLos(los: Array<LearningObject>) {
  const orderedLos = los.filter((lo) => lo.frontMatter?.order);
  const unOrderedLos = los.filter((lo) => !lo.frontMatter?.order);
  orderedLos.sort((a: any, b: any) => a.frontMatter.order - b.frontMatter.order);
  return orderedLos.concat(unOrderedLos);
}
