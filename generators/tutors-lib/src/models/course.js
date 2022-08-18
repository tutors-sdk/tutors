"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const lo_1 = require("./lo");
const loutils_1 = require("../utils/loutils");
const fs = __importStar(require("fs"));
const futils_1 = require("../utils/futils");
const topic_1 = require("./topic");
const version = require('../../package.json').version;
class Course extends lo_1.LearningObject {
    constructor(parent) {
        super(parent);
        this.los = [];
        this.contentMd = "";
        this.walls = [];
        this.los = (0, loutils_1.reapLos)({ parent: this });
        this.lotype = 'course';
        this.reap('course');
        this.contentMd = (0, futils_1.readWholeFile)("course.md");
        const ignoreList = this.properties.ignore;
        if (ignoreList) {
            const los = this.los.filter((lo) => ignoreList.indexOf(lo.folder) >= 0);
            los.forEach((lo) => {
                lo.hide = true;
            });
        }
        this.insertCourseRef(this.los);
        if (fs.existsSync('enrollment.yaml')) {
            this.enrollment = (0, futils_1.readEnrollment)('enrollment.yaml');
            if (this.enrollment) {
                console.log(`Enrolment file detected with ${this.enrollment.students.length} students`);
            }
        }
        if (fs.existsSync('calendar.yaml')) {
            this.calendar = (0, futils_1.readCalendar)('calendar.yaml');
            if (this.enrollment) {
                console.log(`Calendar file detected.`);
            }
        }
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'talk') });
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'lab') });
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'video') });
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'panelvideo') });
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'github') });
        this.walls.push({ course: this, isWall: true, los: (0, loutils_1.findLos)(this.los, 'archive') });
    }
    insertCourseRef(los) {
        los.forEach((lo) => {
            lo.course = this;
            if (lo instanceof topic_1.Topic) {
                this.insertCourseRef(lo.los);
            }
        });
        this.course = this;
    }
    publish(path) {
        console.log(':: ', this.title);
        (0, futils_1.copyFileToFolder)(this.img, path);
        (0, loutils_1.publishLos)(path, this.los);
    }
    gen3() {
    }
}
exports.Course = Course;
//# sourceMappingURL=course.js.map