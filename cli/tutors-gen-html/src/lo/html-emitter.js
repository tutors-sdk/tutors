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
const course_tree_1 = require("./course-tree");
const utils_1 = require("tutors-gen-lib/src/utils/utils");
const nunjucks = __importStar(require("nunjucks"));
function publishTemplate(path, file, template, lo) {
    (0, utils_1.writeFile)(path, file, nunjucks.render(template, { lo: lo }));
}
exports.publishTemplate = publishTemplate;
exports.courseBuilderHtml = {
    emitNote(lo, path) {
        const notePath = `${path}/${lo.id}`;
        publishTemplate(notePath, "index.html", "Note.njk", lo);
    },
    emitLab(lo, path) {
        const labPath = `${path}/${lo.id}`;
        publishTemplate(labPath, "index.html", "Lab.njk", lo);
    },
    emitLoPage(lo, path) {
        if (lo.type == "lab") {
            this.emitLab(lo, path);
        }
        if (lo.type == "note" || lo.type == "panelnote") {
            this.emitNote(lo, path);
        }
    },
    emitUnit(lo, path) {
        lo.los.forEach((lo) => {
            this.emitLoPage(lo, path);
        });
    },
    emitLo(lo, path) {
        if (lo.type == "unit" || lo.type == "side") {
            const unitPath = `${path}/${lo.id}`;
            this.emitUnit(lo, unitPath);
        }
        else {
            this.emitLoPage(lo, path);
        }
    },
    emitTopic(lo, path) {
        var _a;
        sh.cd(lo.id);
        const topicPath = `${path}/${lo.id}`;
        (_a = lo === null || lo === void 0 ? void 0 : lo.los) === null || _a === void 0 ? void 0 : _a.forEach((lo) => {
            this.emitLo(lo, topicPath);
        });
        publishTemplate(topicPath, "index.html", "Topic.njk", lo);
        sh.cd("..");
    },
    generateCourse(path, lo) {
        (0, course_tree_1.buildCourseTree)(lo);
        sh.cd(path);
        lo.los.forEach((lo) => {
            this.emitTopic(lo, path);
        });
        publishTemplate(path, "index.html", "Course.njk", lo);
    },
};
//# sourceMappingURL=html-emitter.js.map