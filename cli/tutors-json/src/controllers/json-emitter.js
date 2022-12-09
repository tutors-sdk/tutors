"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonEmitter = void 0;
const futils_1 = require("tutors-lib/src/utils/futils");
class JsonEmitter {
    constructor() {
        this.version = "0.0";
    }
    emitLo(lo, url, jsonObj) {
        jsonObj.properties = lo.properties;
        jsonObj.title = lo.title;
        jsonObj.type = lo.lotype;
        jsonObj.summary = lo.objectivesMd;
        jsonObj.img = `https://${url}/${lo.img}`;
        if (lo.videoid) {
            jsonObj.video = `#video/${url}/${lo.videoid}`;
        }
        if (lo.videoids) {
            jsonObj.videoids = lo.videoids;
        }
        jsonObj.id = lo.folder;
        jsonObj.route = lo.link;
        jsonObj.hide = lo.hide;
        if (lo.frontMatter) {
            jsonObj.frontMatter = lo.frontMatter;
        }
    }
    emitTalk(lo, url, jsonObj) {
        jsonObj.pdf = `https://${url}/${lo.link}`;
        jsonObj.route = `#talk/${url}/${lo.link}`;
    }
    emitLab(lo, url, jsonObj) {
        jsonObj.route = `#lab/${url}`;
        jsonObj.los = [];
        lo.chapters.forEach((chapter) => {
            const jsonChapter = {};
            jsonChapter.title = chapter.title;
            jsonChapter.shortTitle = chapter.shortTitle;
            jsonChapter.contentMd = chapter.contentMd;
            jsonChapter.route = `${jsonObj.route}/${chapter.shortTitle}`;
            jsonObj.los.push(jsonChapter);
        });
    }
    emitNote(lo, url, jsonObj) {
        jsonObj.route = `#note/${url}`;
        jsonObj.contentMd = lo.contentMd;
        if (lo.frontMatter) {
            jsonObj.frontMatter = lo.frontMatter;
        }
    }
    emitPanelNote(lo, url, jsonObj) {
        jsonObj.route = `#note/${url}`;
        jsonObj.contentMd = lo.contentMd;
        if (lo.frontMatter) {
            jsonObj.frontMatter = lo.frontMatter;
        }
    }
    emitPanelTalk(lo, url, jsonObj) {
        jsonObj.pdf = `https://${url}/${lo.link}`;
        jsonObj.route = `#talk/${url}/${lo.link}`;
    }
    emitArchive(lo, url, jsonObj) {
        jsonObj.route = `https://${url}/${lo.link}`;
    }
    emitPanelVideo(lo, url, jsonObj) {
        jsonObj.route = `#video/${url}/${lo.link}`;
    }
    emitUnit(lo, url, jsonObj) {
        url = url.substring(0, url.lastIndexOf("/")) + "/";
        this.emitTopic(lo, url, jsonObj);
        jsonObj.route = `#topic/${url}`;
    }
    emitTopic(lo, url, jsonObj) {
        var _a;
        const topicUrl = `${url}${lo.folder}`;
        this.emitLo(lo, topicUrl, jsonObj);
        jsonObj.route = `#topic/${topicUrl}`;
        jsonObj.los = [];
        (_a = lo.los) === null || _a === void 0 ? void 0 : _a.forEach((lo) => {
            const loJson = {};
            const baseUrl = `${topicUrl}/${lo.folder}`;
            this.emitLo(lo, baseUrl, loJson);
            switch (lo.lotype) {
                case "unit":
                    this.emitUnit(lo, baseUrl, loJson);
                    break;
                case "talk":
                    this.emitTalk(lo, baseUrl, loJson);
                    break;
                case "lab":
                    this.emitLab(lo, baseUrl, loJson);
                    break;
                case "note":
                    this.emitNote(lo, baseUrl, loJson);
                    break;
                case "panelnote":
                    this.emitPanelNote(lo, baseUrl, loJson);
                    break;
                case "paneltalk":
                    this.emitPanelTalk(lo, baseUrl, loJson);
                    break;
                case "archive":
                    this.emitArchive(lo, baseUrl, loJson);
                    break;
                case "panelvideo":
                    this.emitPanelVideo(lo, baseUrl, loJson);
                    break;
            }
            jsonObj.los.push(loJson);
        });
    }
    emitCourse(lo, url, jsonObj) {
        this.emitLo(lo, url, jsonObj);
        jsonObj.los = [];
        lo.los.forEach((lo) => {
            const topicObj = {};
            this.emitTopic(lo, url, topicObj);
            jsonObj.los.push(topicObj);
        });
        jsonObj.enrollment = lo.enrollment;
        jsonObj.calendar = lo.calendar;
        jsonObj.contentMd = lo.contentMd;
    }
    generateCourse(version, path, course) {
        const courseJson = {};
        courseJson.version = version.toString();
        this.emitCourse(course, "{{COURSEURL}}/", courseJson);
        (0, futils_1.writeFile)(path, "tutors.json", JSON.stringify(courseJson));
    }
}
exports.JsonEmitter = JsonEmitter;
//# sourceMappingURL=json-emitter.js.map