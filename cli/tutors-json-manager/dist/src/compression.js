"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressData = exports.compressData = void 0;
const pako_1 = __importDefault(require("pako"));
const buffer_1 = require("buffer");
function compressData(data) {
    try {
        const compressedData = pako_1.default.deflate(data);
        return buffer_1.Buffer.from(compressedData).toString('base64');
    }
    catch (error) {
        console.error("Error during compression:", error);
        throw new Error("Compression failed.");
    }
}
exports.compressData = compressData;
function decompressData(compressedData) {
    try {
        const binaryData = buffer_1.Buffer.from(compressedData, 'base64');
        const decompressedData = pako_1.default.inflate(binaryData, { to: 'string' });
        return decompressedData;
    }
    catch (error) {
        console.error("Error during decompression:", error);
        throw new Error("Decompression failed.");
    }
}
exports.decompressData = decompressData;
