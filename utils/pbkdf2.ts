// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

const cache = {};

export function PBKDF2(text: string): string {
  var key;

  if (cache[text]) key = cache[text];
  else {
    var enc = CryptoJS.PBKDF2(text, process.env.NEXT_PUBLIC_SALT, {
      keySize: 512 / 32,
    });

    cache[text] = enc.toString();
    key = enc;
  }
  return key.toString();
}
