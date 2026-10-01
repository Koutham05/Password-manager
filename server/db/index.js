const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database/vault.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Initialize database tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      master_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT 'Folder',
      color TEXT DEFAULT '#3b82f6'
    );

    CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      username TEXT,
      email TEXT,
      encrypted_password TEXT NOT NULL,
      iv TEXT NOT NULL,
      tag TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      notes TEXT,
      tags TEXT,
      two_factor_secret TEXT,
      is_favorite INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      password_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      target TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shared_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password_id INTEGER REFERENCES passwords(id) ON DELETE CASCADE,
      recipient_email TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      access_delay_days INTEGER DEFAULT 7,
      status flex TEXT DEFAULT 'ACTIVE',
      requested_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS sync_nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL,
      device_type TEXT DEFAULT 'DESKTOP',
      last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default categories if empty
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (catCount.count === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)');
    const defaultCats = [
      ['Logins & Apps', 'Globe', '#3b82f6'],
      ['Financial & Banking', 'CreditCard', '#10b981'],
      ['Personal & Identity', 'User', '#ec4899'],
      ['Work & Infrastructure', 'Briefcase', '#8b5cf6'],
      ['Secure Notes', 'FileText', '#f59e0b']
    ];
    defaultCats.forEach(([name, icon, color]) => insertCat.run(name, icon, color));
  }

  // Insert default settings if empty
  const setStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  setStmt.run('auto_lock_minutes', '15');
  setStmt.run('clipboard_clear_seconds', '30');
  setStmt.run('theme', 'dark');
}

initDb();

module.exports = db;
