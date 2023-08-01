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
const resource_builder_1 = require("tutors-gen-lib/src/lo/resource-builder");
const course_builder_1 = require("tutors-gen-lib/src/lo/course-builder");
const utils_1 = require("tutors-gen-lib/src/utils/utils");
const nunjucks = __importStar(require("nunjucks"));
const html_emitter_1 = require("./controllers/html-emitter");
const lo_types_1 = require("tutors-gen-lib/src/lo/lo-types");
const version = `tutors-html: 2.6.2 (tutors-lib: 2.6.2)`;
const root = __dirname;
nunjucks.configure(root + "/views", { autoescape: false });
nunjucks.installJinjaCompat();
if (fs.existsSync("course.md")) {
    const srcFolder = process.cwd();
    const destFolder = `${srcFolder}/html`;
    console.log(`Static course generator ${version}`);
    resource_builder_1.resourceBuilder.buildTree(srcFolder);
    course_builder_1.courseBuilder.buildCourse(resource_builder_1.resourceBuilder.lr);
    resource_builder_1.resourceBuilder.copyAssets(destFolder);
    (0, utils_1.writeFile)(destFolder, "tutors.json", JSON.stringify(course_builder_1.courseBuilder.lo));
    (0, lo_types_1.threadLos)(course_builder_1.courseBuilder.lo);
    html_emitter_1.courseBuilderHtml.generateCourse(destFolder, course_builder_1.courseBuilder.lo);
    console.log(`${version}`);
}
else {
    console.log("Cannot locate course.md. Change to course folder and try again. ");
}
//# sourceMappingURL=tutors-html.js.map