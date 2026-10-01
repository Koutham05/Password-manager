const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');

module.exports = function (requireUnlocked, logAudit) {
  router.post('/backup', requireUnlocked, (req, res) => {
    try {
      const backupDir = path.join(__dirname, '../../database/backups');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

      const filename = `vault_backup_${Date.now()}.json`;
      const filePath = path.join(backupDir, filename);

      const passwords = db.prepare('SELECT * FROM passwords').all();
      const categories = db.prepare('SELECT * FROM categories').all();

      const backupPayload = JSON.stringify({ version: '1.0', timestamp: new Date().toISOString(), passwords, categories }, null, 2);
      fs.writeFileSync(filePath, backupPayload, 'utf8');

      const stat = fs.statSync(filePath);
      db.prepare('INSERT INTO backups (filename, size_bytes) VALUES (?, ?)').run(filename, stat.size);

      logAudit('CREATE_BACKUP', `Created file: ${filename}`);
      res.json({ success: true, filename, sizeBytes: stat.size });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/backups', requireUnlocked, (req, res) => {
    try {
      const list = db.prepare('SELECT * FROM backups ORDER BY created_at DESC').all();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
