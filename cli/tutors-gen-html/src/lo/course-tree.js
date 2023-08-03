"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnits = exports.getPanels = exports.buildCourseTree = void 0;
const markdown_1 = require("./markdown");
function buildCourseTree(parent) {
    for (const lo of parent.los) {
        if (lo.contentMd) {
            lo.contentHtml = (0, markdown_1.convertMdToHtml)(lo.contentMd);
        }
        const obj = lo;
        obj.parentLo = parent;
        if (obj.frontMatter && obj.frontMatter.icon) {
            obj.icon = {
                type: obj.frontMatter.icon["type"],
                color: obj.frontMatter.icon["color"],
            };
        }
        else {
            obj.icon = null;
        }
        if (obj.los) {
            obj.panels = getPanels(obj.los);
            obj.units = getUnits(obj.los);
            buildCourseTree(obj);
        }
    }
}
exports.buildCourseTree = buildCourseTree;
function getPanels(los) {
    return {
        panelVideos: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type === "panelvideo"),
        panelTalks: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type === "paneltalk"),
        panelNotes: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type === "panelnote"),
    };
}
exports.getPanels = getPanels;
function getUnits(los) {
    return {
        units: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type === "unit"),
        sides: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type === "side"),
        standardLos: los === null || los === void 0 ? void 0 : los.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "side"),
    };
}
exports.getUnits = getUnits;
//# sourceMappingURL=course-tree.js.map