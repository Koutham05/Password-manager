const crypto = require('crypto');
const argon2 = require('argon2');

/**
 * Fallback key derivation in case argon2 native module has platform architecture mismatch
 */
async function deriveKey(masterPassword, saltHex) {
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
    console.warn('Argon2 fallback to pbkdf2:', err.message);
    return crypto.pbkdf2Sync(masterPassword, saltHex, 100000, 32, 'sha256');
  }
}

async function hashMasterPassword(masterPassword) {
  try {
    return await argon2.hash(masterPassword, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
    });
  } catch (err) {
    console.warn('Argon2 hash fallback:', err.message);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256').toString('hex');
    return `pbkdf2$${salt}$${hash}`;
  }
}

async function verifyMasterPassword(hashStr, masterPassword) {
  try {
    if (hashStr.startsWith('pbkdf2$')) {
      const parts = hashStr.split('$');
      const salt = parts[1];
      const targetHash = parts[2];
      const computedHash = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256').toString('hex');
      return computedHash === targetHash;
    }
    return await argon2.verify(hashStr, masterPassword);
  } catch (err) {
    return false;
  }
}

function encrypt(plaintext, keyBuffer) {
  if (!plaintext) return { encryptedData: '', iv: '', tag: '' };
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    tag: tag
  };
}

function decrypt(encryptedHex, ivHex, tagHex, keyBuffer) {
  if (!encryptedHex) return '';
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  deriveKey,
  hashMasterPassword,
  verifyMasterPassword,
  encrypt,
  decrypt,
  generateSalt
};
