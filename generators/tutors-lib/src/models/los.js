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
exports.Archive = exports.PanelTalk = exports.Talk = exports.DiscreteLearningObject = void 0;
const path = __importStar(require("path"));
const loutils_1 = require("../utils/loutils");
const lo_1 = require("./lo");
const glob = require('glob');
class DiscreteLearningObject extends lo_1.LearningObject {
    constructor(parent) {
        super(parent);
    }
    reap(pattern) {
        this.link = 'error: missing ' + this.lotype;
        let resourceList = glob.sync(pattern).sort();
        if (resourceList.length > 0) {
            const resourceName = path.parse(resourceList[0]).name;
            super.reap(resourceName);
            this.link = resourceList[0];
        }
        else {
            resourceList = glob.sync('*.md').sort();
            const resourceName = path.parse(resourceList[0]).name;
            super.reap(resourceName);
            this.link = resourceList[0];
        }
    }
    publish(path) {
        (0, loutils_1.copyResource)(this.folder, path);
    }
}
exports.DiscreteLearningObject = DiscreteLearningObject;
class Talk extends DiscreteLearningObject {
    constructor(parent) {
        super(parent);
        this.lotype = 'talk';
        this.reap('*.pdf');
    }
}
exports.Talk = Talk;
class PanelTalk extends DiscreteLearningObject {
    constructor(parent) {
        super(parent);
        this.lotype = 'paneltalk';
        this.reap('*.pdf');
    }
}
exports.PanelTalk = PanelTalk;
class Archive extends DiscreteLearningObject {
    constructor(parent) {
        super(parent);
        this.lotype = 'archive';
        this.reap('*.zip');
    }
}
exports.Archive = Archive;
//# sourceMappingURL=los.js.map