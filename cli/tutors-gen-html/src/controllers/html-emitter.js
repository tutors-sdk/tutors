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
exports.courseBuilderHtml = exports.publishTemplate = void 0;
const sh = __importStar(require("shelljs"));
const utils_1 = require("tutors-gen-lib/src/utils/utils");
const nunjucks = __importStar(require("nunjucks"));
const markdown_utils_1 = require("../utils/markdown-utils");
function publishTemplate(path, file, template, lo) {
    (0, utils_1.writeFile)(path, file, nunjucks.render(template, lo));
}
exports.publishTemplate = publishTemplate;
exports.courseBuilderHtml = {
    emitObjectves(lo) {
        var _a, _b;
        // if (lo.frontMatter && lo.frontMatter.icon) {
        //   lo.icon = {
        //     type: lo.frontMatter.icon["type"],
        //     color: lo.frontMatter.icon["color"],
        //   };
        // }
        if (lo && lo.contentMd && lo.contentMd.length > 60) {
            lo.contentMd = (_a = lo === null || lo === void 0 ? void 0 : lo.contentMd) === null || _a === void 0 ? void 0 : _a.substring(0, 60);
            lo.contentMd = (_b = lo === null || lo === void 0 ? void 0 : lo.contentMd) === null || _b === void 0 ? void 0 : _b.concat("...");
        }
        if (lo.contentMd)
            lo.contentHtml = (0, markdown_utils_1.convertMdToHtml)(lo.contentMd);
    },
    emitNote(note, path) {
        note.contentHtml = (0, markdown_utils_1.convertMdToHtml)(note.contentMd);
        const notePath = `${path}/${note.id}`;
        const obj = {
            lo: note
        };
        publishTemplate(notePath, "index.html", "Note.njk", obj);
    },
    emitLab(lab, path) {
        lab.los.forEach((chapter) => {
            chapter.contentHtml = (0, markdown_utils_1.convertMdToHtml)(chapter.contentMd);
            //chapter.title = convertMdToHtml(chapter.title);
        });
        const labPath = `${path}/${lab.id}`;
        const obj = {
            lo: lab
        };
        publishTemplate(labPath, "index.html", "Lab.njk", obj);
    },
    emitUnit(unit, path) {
        unit.los.forEach((lo) => {
            //this.emitObjectves(lo as LearningObject);
            if (lo.type == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.type == "note") {
                this.emitNote(lo, path);
            }
            if (lo.type == "panelnote") {
                const note = lo;
                note.contentMd = this.parser.parse(note.contentMd);
            }
        });
        // unit.standardLos = sortLos(unit.standardLos);
    },
    emitLo(lo, path) {
        if (lo.type == "unit") {
            const unitPath = `${path}/${lo.id}`;
            this.emitUnit(lo, unitPath);
        }
        else {
            if (lo.type == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.type == "panelnote") {
                this.emitNote(lo, path);
            }
            if (lo.type == "note") {
                this.emitNote(lo, path);
            }
            this.emitObjectves(lo);
        }
    },
    emitTopic(topic, path) {
        var _a, _b, _c;
        sh.cd(topic.id);
        this.emitObjectves(topic);
        const topicPath = `${path}/${topic.id}`;
        (_a = topic === null || topic === void 0 ? void 0 : topic.los) === null || _a === void 0 ? void 0 : _a.forEach((lo) => {
            this.emitLo(lo, topicPath);
        });
        const units = (_b = topic === null || topic === void 0 ? void 0 : topic.los) === null || _b === void 0 ? void 0 : _b.filter((lo) => lo.lotype !== "unit");
        const standardLos = (_c = topic === null || topic === void 0 ? void 0 : topic.los) === null || _c === void 0 ? void 0 : _c.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk");
        const obj = {
            lo: topic,
            standardLos: standardLos,
            units: units
        };
        publishTemplate(topicPath, "index.html", "Topic.njk", obj);
        sh.cd("..");
    },
    emitCourse(course, path) {
        course.los.forEach((lo) => {
            this.emitTopic(lo, path);
        });
        publishTemplate(path, "index.html", "Course.njk", { lo: course });
    },
    generateCourse(path, course) {
        sh.cd(path);
        this.emitCourse(course, path);
    }
};
//# sourceMappingURL=html-emitter.js.map