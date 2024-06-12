import { compressAndEncrypt, decryptAndDecompress, isDataEncryptedOrCompressed } from '../src/controller';
import logger from '../src/logger';

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
    const encryptedCompressedData = compressAndEncrypt(courseData, true, true, encryptionKey);
    logger.info("Encrypted and Compressed Data:", encryptedCompressedData);

    // Test isDataEncryptedOrCompressed
    const detectionResult = isDataEncryptedOrCompressed(encryptedCompressedData);
    logger.info("Data State Detection:", detectionResult);

    // Test decrypt and decompress
    const parsedData = JSON.parse(encryptedCompressedData);
    const decryptedDecompressedData = decryptAndDecompress(parsedData, encryptionKey);
    logger.info("Decrypted and Decompressed Data:", decryptedDecompressedData);

    // Validate the result
    const isDataValid = JSON.stringify(decryptedDecompressedData) === JSON.stringify(courseData);
    logger.info(`Test ${isDataValid ? 'passed' : 'failed'}`);
  } catch (error) {
    logger.error(`Test failed: ${(error as Error).message}`);
  }
}

// Run the tests
testController();
