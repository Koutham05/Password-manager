const express = require('express');
const router = express.Router();
const db = require('../db');
const { encrypt, decrypt } = require('../encryption/crypto');
const { broadcastSync } = require('../websocket/sync');

module.exports = function (activeSession, requireUnlocked, logAudit) {
  router.get('/', requireUnlocked, (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT p.*, c.name as category_name, c.color as category_color 
        FROM passwords p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.title ASC
      `).all();

      const passwords = rows.map(r => {
        let decryptedPassword = '';
        try {
          decryptedPassword = decrypt(r.encrypted_password, r.iv, r.tag, activeSession.keyBuffer);
        } catch (e) {
          decryptedPassword = '[[Decryption Error]]';
        }
        return {
          id: r.id,
          title: r.title,
          url: r.url,
          username: r.username,
          email: r.email,
          password: decryptedPassword,
          categoryId: r.category_id,
          categoryName: r.category_name,
          categoryColor: r.category_color,
          notes: r.notes,
          tags: r.tags ? r.tags.split(',') : [],
          twoFactorSecret: r.two_factor_secret,
          isFavorite: Boolean(r.is_favorite),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          passwordUpdatedAt: r.password_updated_at
        };
      });

      res.json(passwords);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', requireUnlocked, (req, res) => {
    try {
      const { title, url, username, email, password, categoryId, notes, tags, twoFactorSecret, isFavorite } = req.body;
      if (!title || !password) {
        return res.status(400).json({ error: 'Title and Password are required.' });
      }

      const encrypted = encrypt(password, activeSession.keyBuffer);
      const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');

      const result = db.prepare(`
        INSERT INTO passwords 
        (title, url, username, email, encrypted_password, iv, tag, category_id, notes, tags, two_factor_secret, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        title, url || '', username || '', email || '', 
        encrypted.encryptedData, encrypted.iv, encrypted.tag, 
        categoryId || null, notes || '', tagsStr, twoFactorSecret || '', isFavorite ? 1 : 0
      );

      logAudit('CREATE_PASSWORD', `Added record: ${title}`);
      broadcastSync('PASSWORD_CREATED', { title });

      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', requireUnlocked, (req, res) => {
    try {
      const { id } = req.params;
      const { title, url, username, email, password, categoryId, notes, tags, twoFactorSecret, isFavorite } = req.body;

      const existing = db.prepare('SELECT * FROM passwords WHERE id = ?').get(id);
      if (!existing) return res.status(404).json({ error: 'Record not found.' });

      let oldPass = '';
      try {
        oldPass = decrypt(existing.encrypted_password, existing.iv, existing.tag, activeSession.keyBuffer);
      } catch (e) {}

      let encrypted = { encryptedData: existing.encrypted_password, iv: existing.iv, tag: existing.tag };
      let passChanged = false;

      if (password && password !== oldPass) {
        encrypted = encrypt(password, activeSession.keyBuffer);
        passChanged = true;
      }

      const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE passwords SET
          title = ?, url = ?, username = ?, email = ?,
          encrypted_password = ?, iv = ?, tag = ?,
          category_id = ?, notes = ?, tags = ?,
          two_factor_secret = ?, is_favorite = ?,
          updated_at = ?,
          password_updated_at = CASE WHEN ? = 1 THEN ? ELSE password_updated_at END
        WHERE id = ?
      `).run(
        title, url || '', username || '', email || '',
        encrypted.encryptedData, encrypted.iv, encrypted.tag,
        categoryId || null, notes || '', tagsStr,
        twoFactorSecret || '', isFavorite ? 1 : 0,
        now, passChanged ? 1 : 0, now, id
      );

      logAudit('UPDATE_PASSWORD', `Updated record: ${title}`);
      broadcastSync('PASSWORD_UPDATED', { id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', requireUnlocked, (req, res) => {
    try {
      const { id } = req.params;
      const item = db.prepare('SELECT title FROM passwords WHERE id = ?').get(id);
      db.prepare('DELETE FROM passwords WHERE id = ?').run(id);

      logAudit('DELETE_PASSWORD', `Deleted record: ${item ? item.title : id}`);
      broadcastSync('PASSWORD_DELETED', { id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
