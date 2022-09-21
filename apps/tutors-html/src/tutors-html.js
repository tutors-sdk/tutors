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
const html_emitter_1 = require("./controllers/html-emitter");
const futils_1 = require("tutors-lib/src/utils/futils");
const tutors = require('../package.json').version;
const tutors_lib = require('../package.json').dependencies['tutors-lib-beta'];
const version = `tutors-html-beta ${tutors} (tutors-lib-beta: ${tutors_lib})`;
const nunjucks = require('nunjucks');
const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();
if (fs.existsSync('course.md')) {
    let folder = process.cwd() + '/public-site';
    const course = new course_1.Course();
    console.log(`Static course generator ${version}`);
    course.publish(folder);
    const emitter = new html_emitter_1.HtmlEmitter();
    emitter.generateCourse(folder, course);
    console.log(`${version}`);
    (0, futils_1.copyFolder)(`${root}/src/assets`, folder);
}
else {
    console.log('Cannot locate course.md. Change to course folder and try again. ');
}
//# sourceMappingURL=tutors-html.js.map