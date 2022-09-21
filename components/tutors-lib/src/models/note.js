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
exports.PanelNote = exports.Note = void 0;
const lo_1 = require("./lo");
const fs = __importStar(require("fs"));
const futils_1 = require("../utils/futils");
const sh = __importStar(require("shelljs"));
const fm = require('front-matter');
class Note extends lo_1.LearningObject {
    constructor(parent) {
        super(parent);
        this.directories = [];
        this.contentMd = '';
        super.reap('note');
        const contents = fm((0, futils_1.readWholeFile)('note.md'));
        if (Object.keys(contents.attributes).length > 0) {
            this.frontMatter = contents.attributes;
        }
        this.contentMd = contents.body;
        this.link = 'index.html';
        this.lotype = 'note';
        if (fs.existsSync('videoid')) {
            this.videoid = (0, futils_1.readFile)('videoid');
        }
        this.directories = (0, futils_1.getDirectories)('.');
    }
    publish(path) {
        sh.cd(this.folder);
        const notePath = path + '/' + this.folder;
        (0, futils_1.initPath)(notePath);
        (0, futils_1.copyFileToFolder)(this.img, notePath);
        this.directories.forEach((directory) => {
            (0, futils_1.copyFolder)(directory, notePath);
        });
        sh.cd('..');
    }
}
exports.Note = Note;
class PanelNote extends Note {
    constructor(parent) {
        super(parent);
        this.lotype = 'panelnote';
    }
}
exports.PanelNote = PanelNote;
//# sourceMappingURL=note.js.map