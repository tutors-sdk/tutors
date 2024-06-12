"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataEncryptedOrCompressed = exports.decryptAndDecompress = exports.compressAndEncrypt = void 0;
const encryption_1 = require("./encryption");
const compression_1 = require("./compression");
const logger_1 = __importDefault(require("./logger"));
function compressAndEncrypt(data, compress = false, encrypt = false, key = '') {
    try {
        let jsonData = JSON.stringify(data);
        let isCompressed = false;
        let isEncrypted = false;
        if (encrypt) {
            if (!key)
                throw new Error('Encryption key must be provided');
            jsonData = (0, encryption_1.encryptData)(jsonData, key);
            isEncrypted = true;
            logger_1.default.info('Encryption successful.');
        }
        if (compress) {
            const originalSize = Buffer.byteLength(jsonData, 'utf8');
            jsonData = (0, compression_1.compressData)(jsonData);
            isCompressed = true;
            const compressedSize = Buffer.byteLength(jsonData, 'utf8');
            const savedPercentage = ((originalSize - compressedSize) / originalSize) * 100;
            logger_1.default.info(`Compression successful. Space saved: ${savedPercentage.toFixed(2)}%`);
        }
        return JSON.stringify({
            isCompressed,
            isEncrypted,
            data: jsonData
        });
    }
    catch (error) {
        logger_1.default.error(`Error during compression and encryption: ${error.message}`);
        throw new Error("Compression/Encryption failed.");
    }
}
exports.compressAndEncrypt = compressAndEncrypt;
function decryptAndDecompress(data, key) {
    try {
        let jsonData = data.data;
        if (data.isCompressed) {
            jsonData = (0, compression_1.decompressData)(jsonData);
            logger_1.default.info('Decompression successful.');
        }
        if (data.isEncrypted) {
            if (!key)
                throw new Error('Decryption key must be provided');
            jsonData = (0, encryption_1.decryptData)(jsonData, key);
            logger_1.default.info('Decryption successful.');
        }
        return JSON.parse(jsonData);
    }
    catch (error) {
        logger_1.default.error(`Error during decryption and decompression: ${error.message}`);
        throw new Error("Decryption/Decompression failed.");
    }
}
exports.decryptAndDecompress = decryptAndDecompress;
function isDataEncryptedOrCompressed(data) {
    try {
        const parsedData = JSON.parse(data);
        return {
            isCompressed: parsedData.isCompressed,
            isEncrypted: parsedData.isEncrypted
        };
    }
    catch (error) {
        console.error("Error parsing data:", error);
        throw new Error("Data detection failed.");
    }
}
exports.isDataEncryptedOrCompressed = isDataEncryptedOrCompressed;
