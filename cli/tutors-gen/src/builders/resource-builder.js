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
exports.resourceBuilder = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const lo_types_1 = require("./lo-types");
exports.resourceBuilder = {
    lr: {},
    root: "",
    getLoType(route) {
        let lotype = (0, utils_1.findFirstMatchingString)(lo_types_1.loTypes, route, this.root);
        if (lotype == "book") {
            lotype = "lab";
        }
        else if (lotype == "") {
            lotype = "unknown";
        }
        return lotype;
    },
    build(dir) {
        const tree = { courseRoot: this.root, route: dir, type: this.getLoType(dir), lrs: [], files: [], id: path_1.default.basename(dir) };
        const files = fs.readdirSync(dir);
        if (files.length > 0) {
            for (const file of files) {
                if (!file.startsWith(".")) {
                    const filePath = `${dir}/${file}`;
                    const stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        tree.lrs.push(this.build(filePath));
                    }
                    else {
                        tree.files.push(filePath);
                    }
                }
            }
        }
        return tree;
    },
    pruneTree(lr) {
        lr.lrs.forEach((resource, index) => {
            if (resource.type === "unknown") {
                lr.lrs.splice(index, 1);
            }
            this.pruneTree(resource);
        });
    },
    buildTree(dir) {
        this.root = dir;
        this.lr = this.build(dir);
        this.lr.type = "course";
        this.lr.lrs = this.lr.lrs.filter((lr) => lr.route.includes("/topic") || lr.route.includes("/unit") || lr.route.includes("/side"));
        this.pruneTree(this.lr);
    },
    copyAssetFiles(lr, dest) {
        lr.files.forEach((file) => {
            if (lo_types_1.assetTypes.includes((0, utils_1.getFileType)(file))) {
                const fileName = (0, utils_1.getFileName)(file);
                const filePath = file.replace(lr.courseRoot, "");
                const destPath = `${dest}${filePath.replace(fileName, "")}`;
                (0, utils_1.copyFileToFolder)(file, destPath);
            }
        });
        lr.lrs.forEach((lr) => this.copyAssetFiles(lr, dest));
    },
    copyAssets(dest) {
        this.copyAssetFiles(this.lr, dest);
    },
};
//# sourceMappingURL=resource-builder.js.map