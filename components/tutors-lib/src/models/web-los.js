"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web = exports.Git = exports.PanelVideo = exports.Video = exports.WebLearningObject = void 0;
const lo_1 = require("./lo");
const futils_1 = require("../utils/futils");
const loutils_1 = require("../utils/loutils");
class WebLearningObject extends lo_1.LearningObject {
    constructor(parent, resourceId) {
        super(parent);
        this.link = (0, futils_1.readFile)(resourceId);
    }
    publish(path) { }
}
exports.WebLearningObject = WebLearningObject;
class Video extends WebLearningObject {
    constructor(parent) {
        super(parent, 'videoid');
        super.reap('video');
        this.lotype = 'video';
    }
    publish(path) {
        (0, loutils_1.copyResource)(this.folder, path);
    }
}
exports.Video = Video;
class PanelVideo extends WebLearningObject {
    constructor(parent) {
        super(parent, 'videoid');
        super.reap('panelvideo');
        this.lotype = 'panelvideo';
    }
    publish(path) {
        (0, loutils_1.copyResource)(this.folder, path);
    }
}
exports.PanelVideo = PanelVideo;
class Git extends WebLearningObject {
    constructor(parent) {
        super(parent, 'githubid');
        super.reap('github');
        this.lotype = 'github';
        this.videoid = 'none';
    }
    publish(path) {
        (0, loutils_1.copyResource)(this.folder, path);
    }
}
exports.Git = Git;
class Web extends WebLearningObject {
    constructor(parent) {
        super(parent, 'weburl');
        super.reap('web');
        this.lotype = 'web';
    }
    publish(path) {
        (0, loutils_1.copyResource)(this.folder, path);
    }
}
exports.Web = Web;
//# sourceMappingURL=web-los.js.map