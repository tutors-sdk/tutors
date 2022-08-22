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
exports.sortLos = exports.copyResource = exports.publishLos = exports.findTalksWithVideos = exports.findLos = exports.findTopLos = exports.reapLos = void 0;
const fs = __importStar(require("fs"));
const sh = __importStar(require("shelljs"));
const los_1 = require("../models/los");
const course_1 = require("../models/course");
const lab_1 = require("../models/lab");
const topic_1 = require("../models/topic");
const web_los_1 = require("../models/web-los");
const note_1 = require("../models/note");
const fm = require('front-matter');
const glob = require('glob');
const nodePath = require('path');
function reapLos({ parent }) {
    let los = reapLoType('course*', parent, (folder) => {
        return new course_1.Course(parent);
    });
    los = los.concat(reapLoType('topic*', parent, (parent) => {
        return new topic_1.Topic(parent);
    }));
    los = los.concat(reapLoType('unit*', parent, (parent) => {
        return new topic_1.Unit(parent);
    }));
    los = los.concat(reapLoType('talk*', parent, (parent) => {
        return new los_1.Talk(parent);
    }));
    los = los.concat(reapLoType('book*', parent, (parent) => {
        return new lab_1.Lab(parent);
    }));
    los = los.concat(reapLoType('video*', parent, (parent) => {
        return new web_los_1.Video(parent);
    }));
    los = los.concat(reapLoType('panelvideo*', parent, (parent) => {
        return new web_los_1.PanelVideo(parent);
    }));
    los = los.concat(reapLoType('paneltalk*', parent, (parent) => {
        return new los_1.PanelTalk(parent);
    }));
    los = los.concat(reapLoType('archive*', parent, (parent) => {
        return new los_1.Archive(parent);
    }));
    los = los.concat(reapLoType('github*', parent, (parent) => {
        return new web_los_1.Git(parent);
    }));
    los = los.concat(reapLoType('web*', parent, (parent) => {
        return new web_los_1.Web(parent);
    }));
    los = los.concat(reapLoType('note*', parent, (parent) => {
        return new note_1.Note(parent);
    }));
    los = los.concat(reapLoType('panelnote*', parent, (parent) => {
        return new note_1.PanelNote(parent);
    }));
    return los;
}
exports.reapLos = reapLos;
function reapLoType(pattern, parent, locreator) {
    const los = [];
    const folders = glob.sync(pattern).sort();
    for (let folder of folders) {
        if (fs.lstatSync(folder).isDirectory()) {
            sh.cd(folder);
            const lo = locreator(parent);
            los.push(lo);
            sh.cd('..');
        }
    }
    return los;
}
function findTopLos(los, lotype) {
    let result = [];
    los.forEach((lo) => {
        if (lo.lotype === lotype) {
            result.push(lo);
        }
    });
    return result;
}
exports.findTopLos = findTopLos;
function findLos(los, lotype) {
    let result = [];
    los.forEach((lo) => {
        if (lo.lotype === lotype) {
            result.push(lo);
        }
        else if (lo instanceof topic_1.Topic) {
            result = result.concat(findLos(lo.los, lotype));
        }
        else if (lo instanceof topic_1.Unit) {
            result = result.concat(findLos(lo.los, lotype));
        }
    });
    return result;
}
exports.findLos = findLos;
function findTalksWithVideos(los) {
    let result = [];
    los.forEach((lo) => {
        if (lo.lotype === 'talk') {
            const talk = lo;
            if (talk.videoid !== 'none') {
                result.push(lo);
            }
        }
        if (lo instanceof topic_1.Topic) {
            result = result.concat(findTalksWithVideos(lo.los));
        }
    });
    return result;
}
exports.findTalksWithVideos = findTalksWithVideos;
function publishLos(path, los) {
    los.forEach((lo) => {
        console.log(`  --> ${lo.title}(${lo.lotype})`);
        lo.publish(path);
    });
}
exports.publishLos = publishLos;
function copyResource(src, dest) {
    dest = dest + '/' + src;
    sh.mkdir('-p', dest);
    sh.cp('-rf', src + '/*.pdf', dest);
    sh.cp('-rf', src + '/*.zip', dest);
    sh.cp('-rf', src + '/*.png', dest);
    sh.cp('-rf', src + '/*.jpg', dest);
    sh.cp('-rf', src + '/*.jpeg', dest);
    sh.cp('-rf', src + '/*.gif', dest);
}
exports.copyResource = copyResource;
function sortLos(los) {
    let result = [];
    let orderedLos = los.filter((lo) => { var _a; return (_a = lo === null || lo === void 0 ? void 0 : lo.frontMatter) === null || _a === void 0 ? void 0 : _a.order; });
    let unOrderedLos = los.filter((lo) => { var _a; return !((_a = lo === null || lo === void 0 ? void 0 : lo.frontMatter) === null || _a === void 0 ? void 0 : _a.order); });
    // @ts-ignore
    orderedLos.sort((a, b) => a.frontMatter.order - b.frontMatter.order);
    return orderedLos.concat(unOrderedLos);
}
exports.sortLos = sortLos;
//# sourceMappingURL=loutils.js.map