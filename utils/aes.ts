// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

export function Encrypt(text) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.NEXT_PUBLIC_ENCRPT
  ).toString();
}

export function Decrypt(text) {
  const bytes = CryptoJS.AES.decrypt(text, process.env.NEXT_PUBLIC_ENCRPT);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}