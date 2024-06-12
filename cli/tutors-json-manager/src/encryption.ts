import CryptoJS from 'crypto-js';

export function encryptData(data: string, key: string): string {
  try {
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error("Error during encryption:", error);
    throw new Error("Encryption failed.");
  }
}

export function decryptData(encryptedData: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Decryption failed.");
  }
}
