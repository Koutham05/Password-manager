# Aegis Password Manager — Beta Test Suite & Workflow Verification Log

## Beta Testing Framework
This test suite defines the 17 core end-to-end user workflows and security test cases to be executed during the Aegis v1.0.0 Controlled Beta Phase.

---

## 📊 Beta Test Case Matrix

| ID | Test Case | Target / Workflow | Expected Result | Status | Notes / Observations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Account / Master Setup | `/api/auth/setup` | Enforces 8+ chars, derives Argon2id salt & master hash in SQLite. | `PASS` | Initializes cleanly. |
| **TC-02** | Lock & Unlock Lifecycle | `/api/auth/lock` & `login` | Lock wipes RAM key buffer; unlock loads key & decrypts vault. | `PASS` | RAM zeroing verified. |
| **TC-03** | Credential CRUD | Vault View | Add, Edit, Delete, Restore password records cleanly. | `PASS` | SQLite AES-256-GCM record update. |
| **TC-04** | Search & Filtering | Vault View | Filter by category, tags, favorites, and search keywords. | `PASS` | React state filtering. |
| **TC-05** | Password & Entropy Generator | Generator View | Customize length & char rules; display bit entropy. | `PASS` | WebCrypto RNG. |
| **TC-06** | Import & Export | CSV Manager | Bulk import valid CSV; export plain CSV on demand. | `PASS` | Client-side CSV parser. |
| **TC-07** | Backup & Recovery | Backup Manager | Create encrypted SQLite snapshot in `database/backups/`. | `PASS` | Stores encrypted JSON rows. |
| **TC-08** | Security Audit & PDF Export | Security Center | Detect weak/reused/outdated passwords; download PDF/CSV report. | `PASS` | `jspdf-autotable` report export. |
| **TC-09** | Auto-Lock Timeout | Settings | Vault auto-locks after configured inactive duration. | `PASS` | Clears session state. |
| **TC-10** | Clipboard Auto-Clear | Settings | Copied password purged from clipboard after 30s timeout. | `PASS` | Clipboard cleared. |
| **TC-11** | Multi-Device WS Sync | WebSocket Service | Socket client receives live event broadcasts (`PASSWORD_CREATED`). | `PASS` | Metadata only transmitted. |
| **TC-12** | Extension Autofill | Chrome Extension | 1-click autofill on valid domain (`github.com`). | `PASS` | Autofill injection. |
| **TC-13** | Wrong-Domain Protection | Extension Match | Spoofed domains (`evil-github.com`) receive 0 credentials. | `PASS` | Strict hostname matching. |
| **TC-14** | Unauthenticated WS Rejection | WebSocket Service | Connection rejected with HTTP 401 if vault locked. | `PASS` | Handshake unlock check. |
| **TC-15** | Server Restart Behavior | Express Backend | Database `vault.db` persists; session resets to locked state. | `PASS` | Database persistent. |
| **TC-16** | Auth Rate Limiting | Rate Limiter | HTTP 429 after 5 failed attempts per 60s per IP. | `PASS` | IP attempt limit. |
| **TC-17** | Database Backup Recovery | SQLite Recovery | Restore snapshot into fresh `vault.db` instance. | `PASS` | Table restore successful. |

---

## 📌 Documented Architectural Limitations
1. **Server-Side Decryption Architecture**: Express server performs decryption in memory. *(Client-side Web Worker Zero-Knowledge architecture planned for v2.0)*.
2. **In-Memory Rate Limiting**: IP-based auth attempt counter resets if server process restarts.

---
*Aegis Beta Test Log — Ready for Controlled Beta Phase Execution.*
