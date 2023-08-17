"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preOrder = exports.Properties = exports.loTypes = void 0;
exports.loTypes = ["note", "book", "archive", "web", "github", "panelnote", "paneltalk", "panelvideo", "talk", "unit", "side", "topic"];
class Properties {
}
exports.Properties = Properties;
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
//# sourceMappingURL=lo-types.js.map