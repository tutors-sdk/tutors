import { LearningObject } from "./lo";
import { Properties } from "../utils/properties";
import { findLos, publishLos, reapLos } from "../utils/loutils";
import * as fs from "fs";
import { copyFileToFolder, readCalendar, readEnrollment, readWholeFile } from "../utils/futils";
import { Topic } from "./topic";

interface LoWall {
  course: Course;
  isWall: boolean;
  los: Array<LearningObject>;
}

export class Course extends LearningObject {
  enrollment?: Properties;
  calendar?: Properties;
  los: Array<LearningObject> = [];
  contentMd = "";
  walls: LoWall[] = [];

  insertCourseRef(los: Array<LearningObject>): void {
    los.forEach((lo) => {
      lo.course = this;
      if (lo instanceof Topic) {
        this.insertCourseRef(lo.los);
      }
    });
    this.course = this;
  }

  constructor(parent?: LearningObject) {
    super(parent);
    this.los = reapLos({ parent: this });
    this.lotype = "course";
    this.reap("course");
    this.contentMd = readWholeFile("course.md");
    const ignoreList = this.properties?.ignore;
    if (ignoreList) {
      const los = this.los.filter((lo) => ignoreList.indexOf(lo.folder) >= 0);
      los.forEach((lo) => {
        lo.hide = true;
      });
    }
    this.insertCourseRef(this.los);
    if (fs.existsSync("enrollment.yaml")) {
      this.enrollment = readEnrollment("enrollment.yaml");
      if (this.enrollment) {
        console.log(`Enrolment file detected with ${this.enrollment.students.length} students`);
      }
    }
    if (fs.existsSync("calendar.yaml")) {
      this.calendar = readCalendar("calendar.yaml");
      if (this.enrollment) {
        console.log(`Calendar file detected.`);
      }
    }
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "talk") });
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "lab") });
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "video") });
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "panelvideo") });
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "github") });
    this.walls.push({ course: this, isWall: true, los: findLos(this.los, "archive") });
  }

  publish(path: string): void {
    console.log(":: ", this.title);
    copyFileToFolder(this.img, path);
    publishLos(path, this.los);
  }
}
