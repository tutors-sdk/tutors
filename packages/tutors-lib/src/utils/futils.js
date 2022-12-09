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
exports.withoutHeaderFromBody = exports.getHeaderFromBody = exports.withoutHeader = exports.getHeader = exports.readCalendar = exports.readEnrollment = exports.readYaml = exports.copyFolder = exports.initPath = exports.copyFileToFolder = exports.verifyFolder = exports.getDirectories = exports.getParentFolder = exports.getImageFile = exports.readWholeFile = exports.readFile = exports.writeFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sh = __importStar(require("shelljs"));
const yaml = __importStar(require("js-yaml"));
sh.config.silent = true;
function writeFile(folder, filename, contents) {
    if (!fs.existsSync(folder)) {
        sh.mkdir(folder);
    }
    return fs.writeFileSync(folder + "/" + filename, contents);
}
exports.writeFile = writeFile;
function readFile(path) {
    if (fs.existsSync(path)) {
        const array = fs.readFileSync(path).toString().split("\n");
        return array[0].replace("\r", "");
    }
    else {
        console.log("unable to locate " + path);
    }
    return "";
}
exports.readFile = readFile;
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
function getImageFile(name) {
    const validImageTypes = ["png", "jpg", "jpeg", "gif"];
    for (const type of validImageTypes) {
        const image = name + "." + type;
        if (fs.existsSync(image)) {
            return image;
        }
    }
    return "";
}
exports.getImageFile = getImageFile;
function getParentFolder() {
    return path.basename(path.dirname(process.cwd()));
}
exports.getParentFolder = getParentFolder;
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
exports.getDirectories = getDirectories;
function verifyFolder(folder) {
    if (!fs.existsSync(folder)) {
        sh.mkdir("-p", folder);
    }
}
exports.verifyFolder = verifyFolder;
function copyFileToFolder(src, dest) {
    if (fs.existsSync(src)) {
        sh.mkdir("-p", dest);
        sh.cp("-rf", src, dest);
    }
}
exports.copyFileToFolder = copyFileToFolder;
function initPath(path) {
    sh.mkdir("-p", path);
}
exports.initPath = initPath;
function copyFolder(src, dest) {
    sh.mkdir("-p", dest);
    sh.cp("-rf", src, dest);
}
exports.copyFolder = copyFolder;
function readYaml(path) {
    let yamlData = null;
    try {
        yamlData = yaml.load(fs.readFileSync(path, "utf8"));
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
    return yamlData;
}
exports.readYaml = readYaml;
function readEnrollment(path) {
    let yamlData = null;
    try {
        yamlData = yaml.load(fs.readFileSync(path, "utf8"));
    }
    catch (err) {
        console.log(`Tutors encountered an error reading Enrolment file:`);
        console.log("--------------------------------------------------------------");
        console.log(err.mark.buffer);
        console.log("--------------------------------------------------------------");
        console.log(err.message);
        console.log("Ignoring the enrolment file for the moment...");
    }
    return yamlData;
}
exports.readEnrollment = readEnrollment;
function readCalendar(path) {
    let yamlData = null;
    try {
        yamlData = yaml.load(fs.readFileSync(path, "utf8"));
    }
    catch (err) {
        console.log(`Tutors encountered an error reading Enrolment file:`);
        console.log("--------------------------------------------------------------");
        console.log(err.mark.buffer);
        console.log("--------------------------------------------------------------");
        console.log(err.message);
        console.log("Ignoring the enrolment file for the moment...");
    }
    return yamlData;
}
exports.readCalendar = readCalendar;
function getHeader(fileName) {
    let header = "";
    const array = fs.readFileSync(fileName).toString().split("\n");
    if (array[0][0] === "#") {
        header = array[0].substring(1);
    }
    else {
        header = array[0];
    }
    return header;
}
exports.getHeader = getHeader;
function withoutHeader(fileName) {
    let content = fs.readFileSync(fileName).toString();
    const line1 = content.indexOf("\n");
    content = content.substring(line1 + 1, content.length);
    content = content.trim();
    const line2 = content.indexOf("\n");
    if (line2 > -1) {
        content = content.substring(0, line2);
    }
    return content;
}
exports.withoutHeader = withoutHeader;
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
//# sourceMappingURL=futils.js.map