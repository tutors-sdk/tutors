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
exports.Unit = exports.Topic = void 0;
const lo_1 = require("./lo");
const loutils_1 = require("../utils/loutils");
const fs = __importStar(require("fs"));
const sh = __importStar(require("shelljs"));
const futils_1 = require("../utils/futils");
class Topic extends lo_1.LearningObject {
    constructor(parent) {
        super(parent);
        this.los = [];
        this.allLos = [];
        this.los = (0, loutils_1.reapLos)({ parent: this });
        this.reap("topic");
        this.link = "index.html";
        this.lotype = "topic";
        this.setDefaultImage();
        this.los.forEach((lo) => this.allLos.push(lo));
        this.units = this.los.filter((lo) => lo.lotype == "unit");
        this.panelVideos = this.los.filter((lo) => lo.lotype == "panelvideo");
        this.panelTalks = this.los.filter((lo) => lo.lotype == "paneltalk");
        this.panelNotes = this.los.filter((lo) => lo.lotype == "panelnote");
        this.standardLos = this.los.filter((lo) => lo.lotype !== "unit" && lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk" && lo.lotype !== "panelnote");
    }
    setDefaultImage() {
        if (!this.img && this.los.length > 0) {
            const img = `${this.los[0].folder}/${this.los[0].img}`;
            if (fs.existsSync(img)) {
                this.img = img;
            }
        }
    }
    publish(path) {
        console.log("::", this.title);
        sh.cd(this.folder);
        const topicPath = `${path}/${this.folder}`;
        (0, futils_1.copyFileToFolder)(this.img, topicPath);
        (0, loutils_1.publishLos)(topicPath, this.los);
        sh.cd("..");
    }
}
exports.Topic = Topic;
class Unit extends Topic {
    constructor(parent) {
        super(parent);
        this.standardLos = [];
        this.lotype = "unit";
        this.standardLos = this.los.filter((lo) => lo.lotype !== "panelvideo" && lo.lotype !== "paneltalk" && lo.lotype !== "panelnote");
    }
}
exports.Unit = Unit;
//# sourceMappingURL=topic.js.map