import pako from 'pako';
import { Buffer } from 'buffer';

export function compressData(data: string): string {
  try {
    const compressedData = pako.deflate(data);
    return Buffer.from(compressedData).toString('base64');
  } catch (error) {
    console.error("Error during compression:", error);
    throw new Error("Compression failed.");
  }
}

export function decompressData(compressedData: string): string {
  try {
    const binaryData = Buffer.from(compressedData, 'base64');
    const decompressedData = pako.inflate(binaryData, { to: 'string' });
    return decompressedData;
  } catch (error) {
    console.error("Error during decompression:", error);
    throw new Error("Decompression failed.");
  }
}
