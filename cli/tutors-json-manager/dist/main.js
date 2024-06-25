"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
// Example usage
const courseData = {
    "fruit": "Apple",
    "size": "Large",
    "color": "Red"
};
const encryptedCompressedData = (0, controller_1.compressAndEncrypt)(courseData, true, true, 'TEST');
console.log("Encrypted and Compressed Data:", encryptedCompressedData);
const parsedData = JSON.parse(encryptedCompressedData);
const decryptedDecompressedData = (0, controller_1.decryptAndDecompress)(parsedData, 'TEST');
console.log("Decrypted and Decompressed Data:", decryptedDecompressedData);
const detectionResult = (0, controller_1.isDataEncryptedOrCompressed)(encryptedCompressedData);
console.log("Data State Detection:", detectionResult);
