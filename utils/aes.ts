// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

export function Encrypt(text: string): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.ENCRPT
  ).toString();
}

export function Decrypt(text: string): string {
  const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRPT);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}