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
exports.HtmlEmitter = exports.publishTemplate = void 0;
const sh = __importStar(require("shelljs"));
const futils_1 = require("tutors-lib/src/utils/futils");
const markdown_parser_1 = require("../utils/markdown-parser");
const markdown_toc_lib_1 = require("../utils/markdown-toc-lib");
const loutils_1 = require("tutors-lib/src/utils/loutils");
const nunjucks = __importStar(require("nunjucks"));
function publishTemplate(path, file, template, lo) {
    (0, futils_1.writeFile)(path, file, nunjucks.render(template, { lo: lo }));
}
exports.publishTemplate = publishTemplate;
class HtmlEmitter {
    constructor() {
        this.parser = new markdown_parser_1.MarkdownParser();
    }
    emitObjectves(lo) {
        var _a, _b;
        if (lo.frontMatter && lo.frontMatter.icon) {
            lo.icon = {
                type: lo.frontMatter.icon["type"],
                color: lo.frontMatter.icon["color"],
            };
        }
        if (lo && lo.objectivesMd && lo.objectivesMd.length > 60) {
            lo.objectivesMd = (_a = lo === null || lo === void 0 ? void 0 : lo.objectivesMd) === null || _a === void 0 ? void 0 : _a.substring(0, 60);
            lo.objectivesMd = (_b = lo === null || lo === void 0 ? void 0 : lo.objectivesMd) === null || _b === void 0 ? void 0 : _b.concat("...");
        }
        if (lo.objectivesMd)
            lo.objectives = this.parser.parse(lo.objectivesMd);
    }
    emitNote(note, path) {
        note.contentMd = this.parser.parse(note.contentMd);
        note.contentMd = (0, markdown_toc_lib_1.generateToc)(note.contentMd);
        const notePath = `${path}/${note.folder}`;
        publishTemplate(notePath, "index.html", "Note.njk", note);
    }
    emitLab(lab, path) {
        lab.chapters.forEach((chapter) => {
            chapter.content = this.parser.parse(chapter.contentMd);
            chapter.title = this.parser.parse(chapter.title);
        });
        const labPath = `${path}/${lab.folder}`;
        publishTemplate(labPath, "index.html", "Lab.njk", lab);
    }
    emitUnit(unit, path) {
        unit.los.forEach((lo) => {
            this.emitObjectves(lo);
            if (lo.lotype == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.lotype == "panelnote") {
                const note = lo;
                note.contentMd = this.parser.parse(note.contentMd);
                note.contentMd = (0, markdown_toc_lib_1.generateToc)(note.contentMd);
            }
        });
        unit.standardLos = (0, loutils_1.sortLos)(unit.standardLos);
    }
    emitLo(lo, path) {
        if (lo.lotype == "unit") {
            const unitPath = `${path}/${lo.folder}`;
            this.emitUnit(lo, unitPath);
        }
        else {
            if (lo.lotype == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.lotype == "panelnote") {
                this.emitNote(lo, path);
            }
            if (lo.lotype == "note") {
                this.emitNote(lo, path);
            }
            this.emitObjectves(lo);
        }
    }
    emitTopic(topic, path) {
        var _a, _b;
        sh.cd(topic.folder);
        this.emitObjectves(topic);
        const topicPath = `${path}/${topic.folder}`;
        (_a = topic === null || topic === void 0 ? void 0 : topic.los) === null || _a === void 0 ? void 0 : _a.forEach((lo) => {
            this.emitLo(lo, topicPath);
        });
        topic.standardLos = (_b = topic === null || topic === void 0 ? void 0 : topic.los) === null || _b === void 0 ? void 0 : _b.filter((lo) => lo.lotype !== "unit" && lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk");
        publishTemplate(topicPath, "index.html", "Topic.njk", topic);
        sh.cd("..");
    }
    emitCourse(course, path) {
        course.los.forEach((lo) => {
            this.emitTopic(lo, path);
        });
        publishTemplate(path, "index.html", "Course.njk", course);
    }
    generateCourse(path, course) {
        sh.cd(path);
        this.emitCourse(course, path);
    }
}
exports.HtmlEmitter = HtmlEmitter;
//# sourceMappingURL=html-emitter.js.map