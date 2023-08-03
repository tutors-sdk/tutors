"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseBuilder = void 0;
const lr_utils_1 = require("./lr-utils");
const lo_types_1 = require("./lo-types");
const utils_1 = require("../utils/utils");
const front_matter_1 = __importDefault(require("front-matter"));
exports.courseBuilder = {
    lo: {},
    buildCompositeLo(lo, lr, level) {
        switch (lo.type) {
            case "unit":
                this.buildUnit(lo);
                break;
            case "side":
                this.buildSide(lo);
                break;
            default:
        }
        lr.lrs.forEach((lr) => {
            lo.los.push(this.buildLo(lr, level + 1));
            lo.los.sort((a, b) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return lo_types_1.preOrder.get(a.type) - lo_types_1.preOrder.get(b.type);
            });
        });
        return lo;
    },
    buildSimpleLo(lo, lr) {
        switch (lo.type) {
            case "lab":
                lo = this.buildLab(lo, lr);
                break;
            case "talk":
                this.buildTalk(lo);
                break;
            case "panelvideo":
                this.buildPanelvideo(lo);
                break;
            case "web":
                lo.route = (0, lr_utils_1.getWebLink)(lr);
                break;
            case "github":
                lo.route = (0, lr_utils_1.getGitLink)(lr);
                break;
            case "archive":
                lo.route = (0, lr_utils_1.getArchive)(lr);
                break;
            default:
        }
        return lo;
    },
    buildLo(lr, level, keyFileName = "") {
        let lo = this.buildDefaultLo(lr, keyFileName);
        console.log(`${"-".repeat(level * 2)}: ${lo.id} : ${lo.title}`);
        if (lo.type === "unit" || lo.type == "side" || lo.type == "topic" || lo.type == "course") {
            lo = this.buildCompositeLo(lo, lr, level);
        }
        else {
            lo = this.buildSimpleLo(lo, lr);
        }
        return lo;
    },
    buildDefaultLo(lr, keyFileName = "") {
        const [title, summary, contentMd, frontMatter] = (0, lr_utils_1.getMarkdown)(lr, keyFileName);
        const videoids = (0, lr_utils_1.readVideoIds)(lr);
        const lo = {
            route: (0, lr_utils_1.getRoute)(lr),
            type: lr.type,
            title: title,
            summary: summary,
            contentMd: contentMd,
            contentHtml: "",
            frontMatter: frontMatter,
            icon: { type: "", color: "" },
            id: (0, lr_utils_1.getId)(lr),
            img: (0, lr_utils_1.getImage)(lr),
            imgFile: (0, lr_utils_1.getImageFile)(lr),
            pdf: (0, lr_utils_1.getPdf)(lr),
            pdfFile: (0, lr_utils_1.getPdfFile)(lr),
            video: (0, lr_utils_1.getVideo)(lr, videoids.videoid),
            videoids: videoids,
            los: [],
            hide: false,
            parentLo: undefined
        };
        return lo;
    },
    buildUnit(lo) {
        lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
        lo.route = lo.route.replace("/unit", "/topic");
    },
    buildTalk(lo) {
        if (!lo.pdf) {
            lo.route = lo.video;
        }
    },
    buildSide(lo) {
        lo.route = lo.route.substring(0, lo.route.lastIndexOf("/")) + "/";
        lo.route = lo.route.replace("/side", "/topic");
    },
    buildPanelvideo(lo) {
        lo.route = lo.video;
    },
    buildLab(lo, lr) {
        const mdFiles = (0, lr_utils_1.getFilesWithType)(lr, "md");
        lo.title = "";
        mdFiles.forEach((chapterName) => {
            const wholeFile = (0, utils_1.readWholeFile)(chapterName);
            const contents = (0, front_matter_1.default)(wholeFile);
            let theTitle = contents.body.substring(0, contents.body.indexOf("\n"));
            theTitle = theTitle.replace("\r", "");
            const shortTitle = chapterName.substring(chapterName.indexOf(".") + 1, chapterName.lastIndexOf("."));
            if (lo.title == "")
                lo.title = shortTitle;
            const labStep = {
                title: theTitle,
                shortTitle: shortTitle,
                contentMd: contents.body,
                contentHtml: "",
                route: `${(0, lr_utils_1.getRoute)(lr)}/${shortTitle}`,
                id: shortTitle,
                type: "step",
                hide: false
            };
            lo.los.push(labStep);
        });
        lo.img = (0, lr_utils_1.getLabImage)(lr);
        lo.imgFile = `img/${(0, lr_utils_1.getLabImageFile)(lr)}`;
        return lo;
    },
    buildCourse(lr) {
        var _a;
        this.lo = this.buildLo(lr, 0, "course.md");
        this.lo.type = "course";
        this.lo.route = "/";
        const propertiesFile = (0, lr_utils_1.getFileWithName)(lr, "properties.yaml");
        if (propertiesFile) {
            this.lo.properties = (0, utils_1.readYamlFile)(propertiesFile);
            const ignoreList = (_a = this.lo.properties) === null || _a === void 0 ? void 0 : _a.ignore;
            if (ignoreList) {
                const los = this.lo.los.filter((lo) => ignoreList.indexOf(lo.id) >= 0);
                los.forEach((lo) => {
                    if ("type" in lo)
                        lo.hide = true;
                });
            }
        }
        const calendarFile = (0, lr_utils_1.getFileWithName)(lr, "calendar.yaml");
        if (calendarFile) {
            this.lo.calendar = (0, utils_1.readYamlFile)(calendarFile);
        }
    },
};
//# sourceMappingURL=course-builder.js.map