/**
 * Client-Side AES-256-GCM Encryption Abstraction
 * Ensures a unique 96-bit random IV for every encryption operation.
 */

export function generateIV() {
  const iv = new Uint8Array(12); // 96-bit IV
  window.crypto.getRandomValues(iv);
  return iv;
}

export async function encryptData(plaintext, keyBytes) {
  if (!plaintext) return { encryptedHex: '', ivHex: '', tagHex: '' };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const iv = generateIV();

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);
  // GCM auth tag is the last 16 bytes
  const cipherText = encryptedArray.slice(0, encryptedArray.length - 16);
  const tag = encryptedArray.slice(encryptedArray.length - 16);

  const bufferToHex = (buf) => Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    encryptedHex: bufferToHex(cipherText),
    ivHex: bufferToHex(iv),
    tagHex: bufferToHex(tag)
  };
}

export async function decryptData(encryptedHex, ivHex, tagHex, keyBytes) {
  if (!encryptedHex) return '';

  const hexToBuffer = (hex) => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  
  const cipherBytes = hexToBuffer(encryptedHex);
  const tagBytes = hexToBuffer(tagHex);
  const iv = hexToBuffer(ivHex);

  const combined = new Uint8Array(cipherBytes.length + tagBytes.length);
  combined.set(cipherBytes);
  combined.set(tagBytes, cipherBytes.length);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    combined
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}
