// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

export function PBKDF2(text: string): string {
  var key = CryptoJS.PBKDF2(text, process.env.NEXT_PUBLIC_SALT, {
    keySize: 512 / 32,
  });
  return key.toString();
}
