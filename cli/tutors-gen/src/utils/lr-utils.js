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
exports.readYaml = exports.readVideoIds = exports.getMarkdown = exports.getVideo = exports.getPdf = exports.getLabImage = exports.getGitLink = exports.getWebLink = exports.getArchive = exports.getImage = exports.getId = exports.getFilesWithTypes = exports.getFilesWithType = exports.getFileWithType = exports.getRoute = exports.getFileWithName = void 0;
const lo_types_1 = require("./../builders/lo-types");
const path_1 = __importDefault(require("path"));
const sh = __importStar(require("shelljs"));
const front_matter_1 = __importDefault(require("front-matter"));
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const utils_1 = require("./utils");
function getFileWithName(lr, file) {
    let foundFilePath = "";
    lr.files.forEach((filePath) => {
        const fileName = filePath.replace(/^.*[\\\/]/, "");
        if (fileName === file) {
            foundFilePath = filePath;
        }
    });
    return foundFilePath;
}
exports.getFileWithName = getFileWithName;
function getRoute(lr) {
    return `/${lr.type}/{{COURSEURL}}${lr.route.replace(lr.courseRoot, "")}`;
}
exports.getRoute = getRoute;
function getFileWithType(lr, types) {
    const files = lr.files.filter((file) => types.includes((0, utils_1.getFileType)(file)));
    if (files.length) {
        return files[0];
    }
    else {
        return "";
    }
}
exports.getFileWithType = getFileWithType;
function getFilesWithType(lr, type) {
    const files = lr.files.filter((file) => type === (0, utils_1.getFileType)(file));
    return files;
}
exports.getFilesWithType = getFilesWithType;
function getFilesWithTypes(lr, types) {
    const files = lr.files.filter((file) => types.includes((0, utils_1.getFileType)(file)));
    return files;
}
exports.getFilesWithTypes = getFilesWithTypes;
function getId(lr) {
    return path_1.default.basename(lr.route);
}
exports.getId = getId;
function getImage(lr) {
    let imageFile = getFileWithType(lr, lo_types_1.imageTypes);
    if (imageFile) {
        imageFile = `https://{{COURSEURL}}${imageFile.replace(lr.courseRoot, "")}`;
    }
    return imageFile;
}
exports.getImage = getImage;
function getArchive(lr) {
    let archiveFile = getFileWithType(lr, ["zip"]);
    if (archiveFile) {
        archiveFile = `https://{{COURSEURL}}${archiveFile.replace(lr.courseRoot, "")}`;
    }
    return archiveFile;
}
exports.getArchive = getArchive;
function getWebLink(lr) {
    const webLinkFile = getFileWithName(lr, "weburl");
    return (0, utils_1.readFirstLineFromFile)(webLinkFile);
}
exports.getWebLink = getWebLink;
function getGitLink(lr) {
    const webLinkFile = getFileWithName(lr, "githubid");
    return (0, utils_1.readFirstLineFromFile)(webLinkFile);
}
exports.getGitLink = getGitLink;
function getLabImage(lr) {
    let foundFilePath = "";
    const imageLrs = lr.lrs.filter((lr) => lr.id === "img");
    if (imageLrs.length > 0) {
        const imageFiles = getFilesWithTypes(imageLrs[0], lo_types_1.imageTypes);
        imageFiles.forEach((filePath) => {
            if (filePath.includes("/img/main")) {
                foundFilePath = `https://{{COURSEURL}}${filePath.replace(lr.courseRoot, "")}`;
            }
        });
    }
    return foundFilePath;
}
exports.getLabImage = getLabImage;
function getPdf(lr) {
    let pdfFile = getFileWithType(lr, ["pdf"]);
    if (pdfFile) {
        pdfFile = `https://{{COURSEURL}}${pdfFile.replace(lr.courseRoot, "")}`;
    }
    return pdfFile;
}
exports.getPdf = getPdf;
function getVideo(lr, id) {
    let videoId = "";
    if (id) {
        videoId = `/video/{{COURSEURL}}${lr.route.replace(lr.courseRoot, "")}/${id}`;
    }
    return videoId;
}
exports.getVideo = getVideo;
function getMarkdown(lr, keyFileName = "") {
    let mdFile = "";
    if (keyFileName) {
        mdFile = getFileWithName(lr, keyFileName);
    }
    else {
        mdFile = getFileWithType(lr, ["md"]);
    }
    if (mdFile) {
        const contents = (0, front_matter_1.default)((0, utils_1.readWholeFile)(mdFile));
        const frontMatter = contents.attributes;
        const title = (0, utils_1.getHeaderFromBody)(contents.body);
        const summary = (0, utils_1.withoutHeaderFromBody)(contents.body);
        const contentsMd = contents.body;
        return [title, summary, contentsMd, frontMatter];
    }
    else {
        return ["", "", "", {}];
    }
}
exports.getMarkdown = getMarkdown;
function parseProperty(nv) {
    const nameValue = nv.split("=");
    nameValue[0] = nameValue[0].replace("\r", "");
    nameValue[1] = nameValue[1].replace("\r", "");
    return { service: nameValue[0], id: nameValue[1] };
}
function readVideoIds(lr) {
    const videos = {
        videoid: "",
        videoIds: [],
    };
    const videoIdFile = getFileWithName(lr, "videoid");
    if (videoIdFile) {
        const entries = fs.readFileSync(videoIdFile).toString().split("\n");
        entries.forEach((entry) => {
            if (entry !== "") {
                if (entry.includes("heanet") || entry.includes("vimp")) {
                    videos.videoIds.push(parseProperty(entry));
                }
                else {
                    videos.videoid = entry;
                    videos.videoIds.push({ service: "youtube", id: entry });
                }
            }
        });
    }
    if (videos.videoIds.length > 0) {
        videos.videoid = videos.videoIds[videos.videoIds.length - 1].id;
    }
    return videos;
}
exports.readVideoIds = readVideoIds;
function readYaml(lr) {
    let yamlData = null;
    const yamlfilePath = getFileWithName(lr, "properties.yaml");
    if (yamlfilePath) {
        try {
            yamlData = yaml.load(fs.readFileSync(yamlfilePath, "utf8"));
        }
        catch (err) {
            console.log(`Tutors encountered an error reading properties.yaml:`);
            console.log("--------------------------------------------------------------");
            console.log(err.mark.buffer);
            console.log("--------------------------------------------------------------");
            console.log(err.message);
            console.log("Review this file and try again....");
            sh.exit(1);
        }
    }
    return yamlData;
}
exports.readYaml = readYaml;
//# sourceMappingURL=lr-utils.js.map