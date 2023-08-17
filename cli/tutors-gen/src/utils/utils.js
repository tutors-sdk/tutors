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
exports.readYamlFile = exports.copyFileToFolder = exports.copyFile = exports.copyFolder = exports.withoutHeaderFromBody = exports.getHeaderFromBody = exports.readFirstLineFromFile = exports.readWholeFile = exports.getFileType = exports.getFileName = exports.findLastMatchingString = exports.findFirstMatchingString = exports.writeFile = void 0;
const fs = __importStar(require("fs"));
const sh = __importStar(require("shelljs"));
const yaml = __importStar(require("js-yaml"));
function writeFile(folder, filename, contents) {
    if (!fs.existsSync(folder)) {
        sh.mkdir(folder);
    }
    return fs.writeFileSync(folder + "/" + filename, contents);
}
exports.writeFile = writeFile;
function findFirstMatchingString(strings, search, courseRoot) {
    search = search.replace(courseRoot, "");
    for (const str of strings) {
        if (search.includes(str)) {
            if (str === "/topic" && search.slice(1).includes("/")) {
                return "unknown";
            }
            else {
                return str.slice(1);
            }
        }
    }
    return "unknown";
}
exports.findFirstMatchingString = findFirstMatchingString;
function findLastMatchingString(strings, search) {
    for (let index = strings.length - 1; index >= 0; index--) {
        const match = strings[index];
        if (search.includes(match)) {
            return match.slice(1);
        }
    }
    return "unknown";
}
exports.findLastMatchingString = findLastMatchingString;
function getFileName(filePath) {
    const fileName = filePath.replace(/^.*[\\\/]/, "");
    return fileName;
}
exports.getFileName = getFileName;
function getFileType(fileName) {
    if (fileName.includes(".")) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return fileName.split(".").pop();
    }
    else {
        return "";
    }
}
exports.getFileType = getFileType;
function readWholeFile(path) {
    if (fs.existsSync(path)) {
        const array = fs.readFileSync(path).toString();
        return array;
    }
    else {
        console.log("unable to locate " + path);
    }
    return "";
}
exports.readWholeFile = readWholeFile;
function readFirstLineFromFile(path) {
    if (fs.existsSync(path)) {
        const array = fs.readFileSync(path).toString().split("\n");
        return array[0].replace("\r", "");
    }
    else {
        console.log("unable to locate " + path);
    }
    return "";
}
exports.readFirstLineFromFile = readFirstLineFromFile;
function getHeaderFromBody(body) {
    let header = "";
    const array = body.split("\n");
    if (array[0][0] === "#") {
        header = array[0].substring(1);
    }
    else {
        header = array[0];
    }
    return header;
}
exports.getHeaderFromBody = getHeaderFromBody;
function withoutHeaderFromBody(body) {
    let content = body;
    const line1 = content.indexOf("\n");
    content = content.substring(line1 + 1, content.length);
    content = content.trim();
    const line2 = content.indexOf("\n");
    if (line2 > -1) {
        content = content.substring(0, line2);
    }
    return content;
}
exports.withoutHeaderFromBody = withoutHeaderFromBody;
function copyFolder(src, dest) {
    sh.mkdir("-p", dest);
    sh.cp("-rf", src, dest);
}
exports.copyFolder = copyFolder;
function copyFile(src, dest) {
    sh.cp(src, dest);
}
exports.copyFile = copyFile;
function copyFileToFolder(src, dest) {
    if (fs.existsSync(src)) {
        sh.mkdir("-p", dest);
        sh.cp("-rf", src, dest);
    }
}
exports.copyFileToFolder = copyFileToFolder;
function readYamlFile(yamlFilePath) {
    let yamlData = null;
    try {
        yamlData = yaml.load(fs.readFileSync(yamlFilePath, "utf8"));
    }
    catch (err) {
        console.log(`Tutors encountered an error reading ${yamlFilePath}:`);
        console.log("--------------------------------------------------------------");
        console.log(err.mark.buffer);
        console.log("--------------------------------------------------------------");
        console.log(err.message);
        console.log("Review this file and try again....");
        sh.exit(1);
    }
    return yamlData;
}
exports.readYamlFile = readYamlFile;
//# sourceMappingURL=utils.js.map