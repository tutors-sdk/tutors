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
exports.readVideoIds = void 0;
const fs = __importStar(require("fs"));
function readVideoIds() {
    let videos = {
        videoid: '',
        videoIds: [],
    };
    if (fs.existsSync('videoid')) {
        const entries = fs.readFileSync('videoid').toString().split('\n');
        entries.forEach((entry) => {
            if (entry !== '') {
                if (entry.includes('heanet') || entry.includes('vimp')) {
                    videos.videoIds.push(parseProperty(entry));
                }
                else {
                    videos.videoid = entry;
                    videos.videoIds.push({ service: 'youtube', id: entry });
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
function parseProperty(nv) {
    const nameValue = nv.split('=');
    nameValue[0] = nameValue[0].replace('\r', '');
    nameValue[1] = nameValue[1].replace('\r', '');
    return { service: nameValue[0], id: nameValue[1] };
}
//# sourceMappingURL=videoutils.js.map