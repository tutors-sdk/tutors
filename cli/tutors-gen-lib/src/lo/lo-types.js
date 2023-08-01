"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadLos = exports.preOrder = exports.loTypes = exports.Properties = exports.assetTypes = exports.imageTypes = void 0;
exports.imageTypes = ["png", "jpg", "jpeg", "gif", "PNG", "JPG", "JPEG", "GIF"];
exports.assetTypes = exports.imageTypes.concat(["pdf", "zip"]);
class Properties {
}
exports.Properties = Properties;
exports.loTypes = ["/note", "/book", "/archive", "/web", "/github", "/panelnote", "/paneltalk", "/panelvideo", "/talk", "/unit", "/side", "/topic"];
exports.preOrder = new Map([
    ["unit", 1],
    ["side", 2],
    ["talk", 3],
    ["lab", 4],
    ["note", 5],
    ["web", 6],
    ["github", 7],
    ["panelnote", 8],
    ["paneltalk", 9],
    ["archive", 10],
    ["panelvideo", 11],
    ["topic", 12],
    ["unknown", 13],
    ["", 0],
]);
function threadLos(parent) {
    for (const lo of parent.los) {
        const obj = lo;
        obj.parentLo = parent;
        if (obj.los) {
            threadLos(obj);
        }
    }
}
exports.threadLos = threadLos;
//# sourceMappingURL=lo-types.js.map