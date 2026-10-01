# Aegis Password Manager - Complete System Architecture & Documentation
Version: 1.0.0
Classification: Technical Architecture & Blueprint
Author: Aegis Core Engineering Team

---

## 1. Executive Overview

Aegis Password Manager is an offline-first, enterprise-grade password management system and security audit platform. It provides end-to-end (E2E) AES-256-GCM vault encryption, Argon2id key derivation, multi-device WebSocket synchronization, 1-click browser auto-fill, and PDF/CSV security health reporting.

---

## 2. Directory & Directory Tree Structure

```text
password-manager/
├── database/
│   └── vault.db                  # Local SQLite database (Foreign Keys, Encrypted Records)
├── extension/
│   ├── manifest.json             # Chrome/Edge Extension Manifest v3 definition
│   ├── content.js                # Web page form detector & auto-fill injector
│   ├── popup.html                # Extension toolbar popup interface
│   └── popup.js                  # 1-click auto-fill script
├── server/
│   ├── db/
│   │   └── index.js              # SQLite database schema, tables & seed initialization
│   ├── encryption/
│   │   └── crypto.js             # Argon2id/PBKDF2 key derivation & AES-256-GCM module
│   └── index.js                  # Express API server & WebSocket E2E sync broadcaster
├── src/
│   ├── assets/                   # Static assets & icons
│   ├── components/
│   │   ├── Header.jsx            # Top search bar, quick action buttons, unlock status
│   │   └── Sidebar.jsx           # Main navigation, category counters, theme switcher
│   ├── pages/
│   │   ├── MasterPasswordScreen.jsx # Vault setup & unlock screen
│   │   ├── DashboardView.jsx        # Stats overview, health score, category distribution
│   │   ├── VaultView.jsx            # All passwords CRUD grid, search, favorites, copy
│   │   ├── PasswordModal.jsx        # Add/Edit password form & quick generator
│   │   ├── CategoriesView.jsx       # Category breakdown table & manager
│   │   ├── GeneratorView.jsx        # Password generator & bit entropy meter
│   │   ├── SecurityCenterView.jsx   # Vulnerability audit, rotation policy, PDF/CSV report
│   │   ├── ExtensionView.jsx        # Browser extension setup guide
│   │   ├── SharingEmergencyView.jsx # Encrypted sharing & emergency trustee contacts
│   │   ├── SyncView.jsx             # E2E WebSocket cloud sync node monitor
│   │   ├── BackupRestoreView.jsx    # Local encrypted backup snapshots
│   │   ├── SettingsView.jsx         # Auto-lock & clipboard timeout rules
│   │   ├── AuditLogView.jsx         # Immutable security audit log table
│   │   └── TrashView.jsx            # Soft-deleted items & restore manager
│   ├── utils/
│   │   └── reportGenerator.js    # jsPDF & autoTable PDF/CSV report builder
│   ├── App.jsx                   # Main React routing container & state engine
│   ├── index.css                 # Tailwind CSS v4 design tokens & theme utility
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML document root
├── package.json                  # Dependencies & scripts runner
├── postcss.config.js             # PostCSS styling setup
└── vite.config.mjs               # Vite build bundler configuration
```

---

## 3. Technology Stack & Dependencies

### Core Frameworks
- **Frontend**: React 18 + Vite 8 + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)
- **Real-Time Communications**: WebSockets (`ws`)
- **PDF Generation**: `jspdf` + `jspdf-autotable`

### Security & Cryptography Specification
- **Master Key Derivation**: Argon2id (`argon2`) with 32-byte key output, 64MB memory cost, 3 time cost, 4 parallelism (with PBKDF2 fallback SHA-256 at 100,000 iterations).
- **Symmetric Vault Encryption**: **AES-256-GCM** (Galois/Counter Mode) with unique 96-bit random IV and authentication tag per record.
- **Zero-Knowledge Session**: Master Key exists strictly in volatile Node.js server RAM when unlocked. It is wiped on lock or timeout.

---

## 4. Module Architecture & End-to-End Workflows

### A. Authentication & Unlock Workflow
```text
[Launch App] ──> [Master Password Screen] ──> [Verify Argon2 Hash] ──> [Derive AES Key] ──> [Store In RAM] ──> [Unlock Vault]
```

### B. Credential Storage & Encryption Workflow
```text
[User Inputs Password] ──> [AES-256-GCM Encrypt(password, AES_Key)] ──> [Generate Random IV + Tag] ──> [Store in SQLite]
```

### C. Browser Auto-Fill Workflow
```text
[User Visits Website] ──> [Extension content.js Detects Form] ──> [Query /api/extension/match?domain=...] ──> [1-Click Auto-Fill]
```

### D. Security Audit & Report Export Workflow
```text
[Scan Vault Credentials] ──> [Check Strength/Age/Reuses] ──> [Calculate Health Score] ──> [Export PDF/CSV via reportGenerator.js]
```

---

## 5. API Endpoints Specification

| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/status` | Check if vault is initialized and unlocked | No |
| `POST` | `/api/auth/setup` | First-time master password initialization | No |
| `POST` | `/api/auth/login` | Authenticate master password & load AES key | No |
| `POST` | `/api/auth/lock` | Purge AES key from memory & lock vault | Yes |
| `GET` | `/api/dashboard` | Fetch stats, security score, recent activity | Yes |
| `GET` | `/api/passwords` | Fetch all decrypted credentials | Yes |
| `POST` | `/api/passwords` | Encrypt & save new credential record | Yes |
| `PUT` | `/api/passwords/:id` | Update existing credential | Yes |
| `DELETE` | `/api/passwords/:id` | Soft-delete credential | Yes |
| `GET` | `/api/security/audit` | Scan vault for weak/reused/outdated passwords | Yes |
| `GET` | `/api/extension/match` | Query matching login for domain auto-fill | Yes |
| `POST` | `/api/backup` | Create encrypted local database snapshot | Yes |

---

## 6. How to Run & Build

### Development Mode
```bash
npm run dev
```
- App UI: `http://localhost:5173`
- Backend API & WebSockets: `http://localhost:5000`

### Production Build
```bash
npm run build
```

---
*Aegis Vault Architecture Document — Generated Successfully.*
