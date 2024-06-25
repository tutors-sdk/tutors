"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../src/controller");
const logger_1 = __importDefault(require("../src/logger"));
const courseData = {
    "fruit": "Apple",
    "size": "Large",
    "color": "Red"
};
const encryptionKey = 'TEST';
// Function to test the controller methods
function testController() {
    try {
        // Test compress and encrypt
        const encryptedCompressedData = (0, controller_1.compressAndEncrypt)(courseData, true, true, encryptionKey);
        logger_1.default.info("Encrypted and Compressed Data:", encryptedCompressedData);
        // Test isDataEncryptedOrCompressed
        const detectionResult = (0, controller_1.isDataEncryptedOrCompressed)(encryptedCompressedData);
        logger_1.default.info("Data State Detection:", detectionResult);
        // Test decrypt and decompress
        const parsedData = JSON.parse(encryptedCompressedData);
        const decryptedDecompressedData = (0, controller_1.decryptAndDecompress)(parsedData, encryptionKey);
        logger_1.default.info("Decrypted and Decompressed Data:", decryptedDecompressedData);
        // Validate the result
        const isDataValid = JSON.stringify(decryptedDecompressedData) === JSON.stringify(courseData);
        logger_1.default.info(`Test ${isDataValid ? 'passed' : 'failed'}`);
    }
    catch (error) {
        logger_1.default.error(`Test failed: ${error.message}`);
    }
}
// Run the tests
testController();
