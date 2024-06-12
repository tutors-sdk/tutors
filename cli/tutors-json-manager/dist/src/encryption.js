"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
function encryptData(data, key) {
    try {
        return crypto_js_1.default.AES.encrypt(data, key).toString();
    }
    catch (error) {
        console.error("Error during encryption:", error);
        throw new Error("Encryption failed.");
    }
}
exports.encryptData = encryptData;
function decryptData(encryptedData, key) {
    try {
        const bytes = crypto_js_1.default.AES.decrypt(encryptedData, key);
        return bytes.toString(crypto_js_1.default.enc.Utf8);
    }
    catch (error) {
        console.error("Error during decryption:", error);
        throw new Error("Decryption failed.");
    }
}
exports.decryptData = decryptData;
