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
exports.LearningObject = void 0;
const path = __importStar(require("path"));
const futils_1 = require("../utils/futils");
const fs = __importStar(require("fs"));
const videoutils_1 = require("../utils/videoutils");
const fm = require('front-matter');
class LearningObject {
    constructor(parent) {
        this.hide = false;
        if (parent) {
            this.parent = parent;
        }
        this.lotype = 'lo';
    }
    reap(pattern) {
        this.folder = path.basename(process.cwd());
        this.parentFolder = (0, futils_1.getParentFolder)();
        this.img = (0, futils_1.getImageFile)(pattern);
        if (fs.existsSync('properties.yaml')) {
            this.properties = (0, futils_1.readYaml)('properties.yaml');
        }
        if (fs.existsSync(pattern + '.md')) {
            const contents = fm((0, futils_1.readWholeFile)(pattern + '.md'));
            if (Object.keys(contents.attributes).length > 0) {
                this.frontMatter = contents.attributes;
            }
            this.title = (0, futils_1.getHeaderFromBody)(contents.body);
            this.title = this.title + ' ';
            this.objectivesMd = (0, futils_1.withoutHeaderFromBody)(contents.body);
        }
        else {
            this.title = pattern;
        }
        this.videoids = (0, videoutils_1.readVideoIds)();
        this.videoid = this.videoids.videoid;
    }
}
exports.LearningObject = LearningObject;
//# sourceMappingURL=lo.js.map