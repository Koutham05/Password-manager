const express = require('express');
const router = express.Router();
const db = require('../db');
const { 
  deriveKey, 
  hashMasterPassword, 
  verifyMasterPassword, 
  generateSalt 
} = require('../encryption/crypto');
const { rateLimiter } = require('../middleware/rateLimit');

module.exports = function (activeSession, logAudit) {
  router.get('/status', (req, res) => {
    const user = db.prepare('SELECT id FROM users LIMIT 1').get();
    res.json({
      initialized: !!user,
      unlocked: activeSession.unlocked
    });
  });

  router.post('/setup', rateLimiter(3, 60000), async (req, res) => {
    try {
      const existing = db.prepare('SELECT id FROM users LIMIT 1').get();
      if (existing) {
        return res.status(400).json({ error: 'Vault is already initialized.' });
      }

      const { masterPassword } = req.body;
      if (!masterPassword || masterPassword.length < 8) {
        return res.status(400).json({ error: 'Master password must be at least 8 characters long.' });
      }

      const salt = generateSalt();
      const masterHash = await hashMasterPassword(masterPassword);
      const keyBuffer = await deriveKey(masterPassword, salt);

      db.prepare('INSERT INTO users (master_hash, salt) VALUES (?, ?)').run(masterHash, salt);

      activeSession.unlocked = true;
      activeSession.keyBuffer = keyBuffer;
      activeSession.lastActive = Date.now();

      logAudit('VAULT_INITIALIZED', 'Created master password & vault');
      res.json({ success: true, message: 'Vault initialized successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/login', rateLimiter(5, 60000), async (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users LIMIT 1').get();
      if (!user) {
        return res.status(400).json({ error: 'Vault not initialized.' });
      }

      const { masterPassword } = req.body;
      const isValid = await verifyMasterPassword(user.master_hash, masterPassword);

      if (!isValid) {
        logAudit('LOGIN_FAILED', 'Invalid master password attempt');
        return res.status(401).json({ error: 'Incorrect master password.' });
      }

      const keyBuffer = await deriveKey(masterPassword, user.salt);
      activeSession.unlocked = true;
      activeSession.keyBuffer = keyBuffer;
      activeSession.lastActive = Date.now();

      logAudit('VAULT_UNLOCKED', 'Master password verified');
      res.json({ success: true, message: 'Vault unlocked.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/lock', (req, res) => {
    activeSession.unlocked = false;
    activeSession.keyBuffer = null;
    activeSession.lastActive = 0;
    
    const { terminateAllConnections } = require('../websocket/sync');
    terminateAllConnections();

    logAudit('VAULT_LOCKED', 'User locked vault');
    res.json({ success: true, message: 'Vault locked.' });
  });

  return router;
};
