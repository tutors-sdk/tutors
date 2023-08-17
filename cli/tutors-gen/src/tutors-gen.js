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
const course_builder_1 = require("./builders/course-builder");
const resource_builder_1 = require("./builders/resource-builder");
const netlify_1 = require("./utils/netlify");
const version = `tutors-gen 2.9.15`;
if (fs.existsSync("course.md")) {
    const srcFolder = process.cwd();
    const destFolder = `${srcFolder}/json`;
    console.log(`Static course generator ${version}`);
    resource_builder_1.resourceBuilder.buildTree(srcFolder);
    course_builder_1.courseBuilder.buildCourse(resource_builder_1.resourceBuilder.lr);
    resource_builder_1.resourceBuilder.copyAssets(destFolder);
    course_builder_1.courseBuilder.generateCourse(destFolder);
    (0, netlify_1.generateNetlifyToml)(destFolder);
    console.log(`${version}`);
}
else {
    console.log("Cannot locate course.md. Please Change to course folder and try again. ");
}
//# sourceMappingURL=tutors-gen.js.map