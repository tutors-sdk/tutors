import { encryptData, decryptData } from './encryption';
import { compressData, decompressData } from './compression';
import logger from './logger';

interface EncryptedCompressedData {
  isCompressed: boolean;
  isEncrypted: boolean;
  data: string;
}

export function compressAndEncrypt(data: object, compress: boolean = false, encrypt: boolean = false, key: string = ''): string {
  try {
    let jsonData = JSON.stringify(data);
    let isCompressed = false;
    let isEncrypted = false;

    if (encrypt) {
      if (!key) throw new Error('Encryption key must be provided');
      jsonData = encryptData(jsonData, key);
      isEncrypted = true;
      logger.info('Encryption successful.');
    }

    if (compress) {
      const originalSize = Buffer.byteLength(jsonData, 'utf8');
      jsonData = compressData(jsonData);
      isCompressed = true;
      const compressedSize = Buffer.byteLength(jsonData, 'utf8');
      const savedPercentage = ((originalSize - compressedSize) / originalSize) * 100;
      logger.info(`Compression successful. Space saved: ${savedPercentage.toFixed(2)}%`);
    }

    return JSON.stringify({
      isCompressed,
      isEncrypted,
      data: jsonData
    });
  } catch (error) {
    logger.error(`Error during compression and encryption: ${(error as Error).message}`);
    throw new Error("Compression/Encryption failed.");
  }
}

export function decryptAndDecompress(data: EncryptedCompressedData, key: string): object {
  try {
    let jsonData = data.data;

    if (data.isCompressed) {
      jsonData = decompressData(jsonData);
      logger.info('Decompression successful.');
    }

    if (data.isEncrypted) {
      if (!key) throw new Error('Decryption key must be provided');
      jsonData = decryptData(jsonData, key);
      logger.info('Decryption successful.');
    }

    return JSON.parse(jsonData);
  } catch (error) {
    logger.error(`Error during decryption and decompression: ${(error as Error).message}`);
    throw new Error("Decryption/Decompression failed.");
  }
}

export function isDataEncryptedOrCompressed(data: string): { isCompressed: boolean; isEncrypted: boolean } {
  try {
    const parsedData: EncryptedCompressedData = JSON.parse(data);
    return {
      isCompressed: parsedData.isCompressed,
      isEncrypted: parsedData.isEncrypted
    };
  } catch (error) {
    console.error("Error parsing data:", error);
    throw new Error("Data detection failed.");
  }
}
