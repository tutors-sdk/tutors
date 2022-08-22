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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lab = exports.Chapter = void 0;
const lo_1 = require("./lo");
const fs = __importStar(require("fs"));
const futils_1 = require("../utils/futils");
const path = __importStar(require("path"));
const sh = __importStar(require("shelljs"));
const front_matter_1 = __importDefault(require("front-matter"));
const glob = require('glob');
class Chapter {
    constructor() {
        this.title = '';
        this.shortTitle = '';
        this.contentMd = '';
        this.content = '';
        this.route = '';
    }
}
exports.Chapter = Chapter;
class Lab extends lo_1.LearningObject {
    constructor(parent) {
        super(parent);
        this.directories = [];
        this.chapters = [];
        this.reap();
        this.link = 'index.html';
        this.lotype = 'lab';
        if (fs.existsSync('videoid')) {
            this.videoid = (0, futils_1.readFile)('videoid');
        }
    }
    reapChapters(mdFiles) {
        const chapters = [];
        mdFiles.forEach((chapterName) => {
            const wholeFile = (0, futils_1.readWholeFile)(chapterName);
            const contents = (0, front_matter_1.default)(wholeFile);
            let theTitle = contents.body.substr(0, contents.body.indexOf('\n'));
            theTitle = theTitle.replace('\r', '');
            const chapter = {
                file: chapterName,
                title: theTitle,
                shortTitle: chapterName.substring(chapterName.indexOf('.') + 1, chapterName.lastIndexOf('.')),
                contentMd: contents.body,
                route: '',
                content: '',
            };
            chapters.push(chapter);
        });
        return chapters;
    }
    reap() {
        let mdFiles = glob.sync('*.md').sort();
        if (mdFiles.length === 0) {
            return;
        }
        const resourceName = path.parse(mdFiles[0]).name;
        super.reap(resourceName);
        this.directories = (0, futils_1.getDirectories)('.');
        this.chapters = this.reapChapters(mdFiles);
        this.title = this.chapters[0].shortTitle;
        this.img = (0, futils_1.getImageFile)('img/main');
    }
    publish(path) {
        sh.cd(this.folder);
        const labPath = path + '/' + this.folder;
        (0, futils_1.initPath)(labPath);
        this.directories.forEach((directory) => {
            (0, futils_1.copyFolder)(directory, labPath);
        });
        sh.cd('..');
    }
}
exports.Lab = Lab;
//# sourceMappingURL=lab.js.map