# Aegis Password Manager — Version 1.0.0 (Beta Release)

## Release Summary
All planned security remediation items for the current beta scope have been completed. Aegis Password Manager v1.0.0 is an offline-first desktop/web password vault featuring AES-256-GCM encryption, Argon2id master key derivation, Manifest V3 Chrome/Edge auto-fill extension, multi-device WebSocket synchronization, security health audit scanner, and PDF/CSV report exports.

---

## ╔══════════════════════════════════════╗
## ║       AEGIS PASSWORD MANAGER         ║
## ╠══════════════════════════════════════╣
## ║ Core Functionality       ✅ PASS     ║
## ║ Cryptography             ✅ PASS     ║
## ║ Database Protection      ✅ PASS     ║
## ║ Authentication           ✅ PASS     ║
## ║ WebSocket Security       ✅ PASS     ║
## ║ Extension Security       ✅ PASS     ║
## ║ API Authorization        ✅ PASS     ║
## ║ CORS / HTTP Hardening    ✅ PASS     ║
## ║ Dependency Audit         ✅ PASS     ║
## ║ Build                    ✅ PASS     ║
## ║                                      ║
## ║ Zero-Knowledge           🟡 FUTURE   ║
## ║ Rate Limiting            🟡 LIMIT    ║
## ╠══════════════════════════════════════╣
## ║ STATUS: 🟡 BETA READY               ║
## ╚══════════════════════════════════════╝

---

## 🔒 Security Architecture Overview

### Cryptography Specification
- **Symmetric Encryption**: AES-256-GCM (Galois/Counter Mode) with unique 96-bit random Initialization Vector (IV) and 16-byte authentication tag per credential record.
- **Key Derivation**: Argon2id (`timeCost: 3`, `memoryCost: 64MB`, `parallelism: 4`, `salt: 16 bytes`) with PBKDF2 WebCrypto fallback (100,000 iterations).
- **Random Number Generation**: Cryptographically secure RNG via Node.js `crypto.randomBytes` and browser `window.crypto.getRandomValues`.

### Session & Memory Security
- Master keys reside exclusively in volatile server RAM while unlocked.
- Executing `/api/auth/lock` instantly zero-fills memory buffers, invalidates active sessions, and severs all connected WebSocket sync sockets.

---

## 🌐 Modules & Key Features

1. **Dashboard Analytics**: Vault security score, credential strength breakdown, category distribution, recent items.
2. **Password Vault**: Full CRUD, live search, category filtering, favorites, reveal toggle, auto-clearing clipboard buffer.
3. **Password Generator**: Customizable character rules and real-time entropy bit calculator.
4. **Security Center & Audit Reports**: Vulnerability scanner (weak/reused/outdated credentials), Master Password age tracking, and downloadable PDF/CSV security reports.
5. **Manifest V3 Extension**: 1-click password auto-fill on Chrome/Edge with strict domain hostname isolation.
6. **Multi-Device E2E Sync**: WebSocket notification service for real-time vault updates.
7. **Sharing & Emergency Access**: Encrypted password sharing and trustee contacts.
8. **Encrypted Backups**: Local snapshot generator storing encrypted table rows.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ and npm installed.

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Start API Server (Port 5000) & Client (Port 5173) concurrently
npm run dev
```

Open your web browser and navigate to **http://localhost:5173** to unlock your vault!

### Production Build
```bash
npm run build
```

---

## 📑 Documented Architectural Limitations
- **Server-Side Decryption Architecture**: Express server performs in-memory decryption upon user request. *(Client-side Web Worker Zero-Knowledge architecture planned for v2.0)*.
- **In-Memory Rate Limiting**: IP-based auth attempt counter resets if server process restarts.
