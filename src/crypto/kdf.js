/**
 * Client-Side Key Derivation Function (KDF) Abstraction
 * Uses Argon2id (via native/web bindings) with fallback to WebCrypto PBKDF2
 */
import argon2 from 'argon2';

export async function deriveClientKey(masterPassword, saltHex) {
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const keyBuffer = await argon2.hash(masterPassword, {
      type: argon2.argon2id,
      salt,
      hashLength: 32,
      raw: true,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
    });
    return keyBuffer;
  } catch (err) {
    // Fallback to WebCrypto / PBKDF2 algorithm in pure browser contexts
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(masterPassword);
    const saltBytes = encoder.encode(saltHex);

    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const rawKey = await window.crypto.subtle.exportKey('raw', derivedKey);
    return new Uint8Array(rawKey);
  }
}
