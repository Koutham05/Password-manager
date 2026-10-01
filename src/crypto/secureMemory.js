/**
 * Client Secure Memory & Session Cleanup Utilities
 * Minimizes lifetime of sensitive key material in memory.
 */

let activeVaultKey = null;

export function setMemoryKey(keyBytes) {
  activeVaultKey = keyBytes;
}

export function getMemoryKey() {
  return activeVaultKey;
}

export function clearMemoryKey() {
  if (activeVaultKey) {
    if (typeof activeVaultKey.fill === 'function') {
      activeVaultKey.fill(0); // Zero-out buffer memory
    }
    activeVaultKey = null;
  }
}

export function lockVaultSession() {
  clearMemoryKey();
  sessionStorage.clear();
}
