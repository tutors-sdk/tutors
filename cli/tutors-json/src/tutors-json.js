#!/usr/bin/env node
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
const fs = __importStar(require("fs"));
const course_1 = require("tutors-lib/src/models/course");
const json_emitter_1 = require("./controllers/json-emitter");
const netlify_1 = require("./controllers/netlify");
const version = `tutors-json 2.6.2 (tutors-lib: 2.6.2)`;
if (fs.existsSync("course.md")) {
    const course = new course_1.Course();
    const folder = process.cwd() + "/json";
    console.log(`Static course generator ${version}`);
    course.publish(folder);
    const emitter = new json_emitter_1.JsonEmitter();
    emitter.generateCourse(version, folder, course);
    (0, netlify_1.generateNetlifyToml)(folder);
    console.log(` ${version}`);
}
else {
    console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
//# sourceMappingURL=tutors-json.js.map