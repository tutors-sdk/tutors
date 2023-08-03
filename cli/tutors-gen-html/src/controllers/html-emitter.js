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
exports.courseBuilderHtml = exports.threadLos = exports.publishTemplate = void 0;
const sh = __importStar(require("shelljs"));
const utils_1 = require("tutors-gen-lib/src/utils/utils");
const nunjucks = __importStar(require("nunjucks"));
const markdown_utils_1 = require("../utils/markdown-utils");
function publishTemplate(path, file, template, lo) {
    (0, utils_1.writeFile)(path, file, nunjucks.render(template, lo));
}
exports.publishTemplate = publishTemplate;
function threadLos(parent) {
    for (const lo of parent.los) {
        if (lo.contentMd) {
            lo.contentHtml = (0, markdown_utils_1.convertMdToHtml)(lo.contentMd);
        }
        const obj = lo;
        obj.parentLo = parent;
        if (obj.frontMatter && obj.frontMatter.icon) {
            obj.icon = {
                type: obj.frontMatter.icon["type"],
                color: obj.frontMatter.icon["color"],
            };
        }
        else {
            obj.icon = null;
        }
        if (obj.los) {
            threadLos(obj);
        }
    }
}
exports.threadLos = threadLos;
exports.courseBuilderHtml = {
    emitLo(lo, path) {
        if (lo.type == "unit" || lo.type == "side") {
            const unitPath = `${path}/${lo.id}`;
            this.emitUnit(lo, unitPath);
        }
        else {
            if (lo.type == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.type == "note" || lo.type == "panelnote") {
                this.emitNote(lo, path);
            }
        }
    },
    emitNote(note, path) {
        const notePath = `${path}/${note.id}`;
        publishTemplate(notePath, "index.html", "Note.njk", {
            lo: note
        });
    },
    emitLab(lab, path) {
        const labPath = `${path}/${lab.id}`;
        publishTemplate(labPath, "index.html", "Lab.njk", {
            lo: lab
        });
    },
    emitUnit(unit, path) {
        var _a, _b, _c;
        unit.los.forEach((lo) => {
            if (lo.type == "lab") {
                this.emitLab(lo, path);
            }
            if (lo.type == "note" || lo.type == "panelnote") {
                this.emitNote(lo, path);
            }
        });
        unit.panels = {
            panelVideos: (_a = unit.los) === null || _a === void 0 ? void 0 : _a.filter((lo) => lo.type === "panelvideo"),
            panelTalks: (_b = unit.los) === null || _b === void 0 ? void 0 : _b.filter((lo) => lo.type === "paneltalk"),
            panelNotes: (_c = unit.los) === null || _c === void 0 ? void 0 : _c.filter((lo) => lo.type === "panelnote")
        };
    },
    emitTopic(lo, path) {
        var _a, _b, _c, _d, _e, _f, _g;
        sh.cd(lo.id);
        const topicPath = `${path}/${lo.id}`;
        (_a = lo === null || lo === void 0 ? void 0 : lo.los) === null || _a === void 0 ? void 0 : _a.forEach((lo) => {
            this.emitLo(lo, topicPath);
        });
        lo.panels = {
            panelVideos: (_b = lo === null || lo === void 0 ? void 0 : lo.los) === null || _b === void 0 ? void 0 : _b.filter((lo) => lo.type === "panelvideo"),
            panelTalks: (_c = lo === null || lo === void 0 ? void 0 : lo.los) === null || _c === void 0 ? void 0 : _c.filter((lo) => lo.type === "paneltalk"),
            panelNotes: (_d = lo === null || lo === void 0 ? void 0 : lo.los) === null || _d === void 0 ? void 0 : _d.filter((lo) => lo.type === "panelnote")
        };
        lo.units = (_e = lo === null || lo === void 0 ? void 0 : lo.los) === null || _e === void 0 ? void 0 : _e.filter((lo) => lo.type === "unit");
        lo.sides = (_f = lo === null || lo === void 0 ? void 0 : lo.los) === null || _f === void 0 ? void 0 : _f.filter((lo) => lo.type === "side");
        lo.standardLos = (_g = lo === null || lo === void 0 ? void 0 : lo.los) === null || _g === void 0 ? void 0 : _g.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "side");
        publishTemplate(topicPath, "index.html", "Topic.njk", {
            lo: lo,
        });
        sh.cd("..");
    },
    generateCourse(path, lo) {
        threadLos(lo);
        sh.cd(path);
        lo.los.forEach((lo) => {
            this.emitTopic(lo, path);
        });
        publishTemplate(path, "index.html", "Course.njk", { lo: lo });
    }
};
//# sourceMappingURL=html-emitter.js.map