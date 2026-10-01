const express = require('express');
const router = express.Router();
const db = require('../db');
const { decrypt } = require('../encryption/crypto');

module.exports = function (activeSession, requireUnlocked) {
  router.get('/audit', requireUnlocked, (req, res) => {
    try {
      const rows = db.prepare('SELECT p.*, c.name as category_name FROM passwords p LEFT JOIN categories c ON p.category_id = c.id').all();
      let auditResults = [];
      let passMap = {};

      rows.forEach(r => {
        let pass = '';
        try {
          pass = decrypt(r.encrypted_password, r.iv, r.tag, activeSession.keyBuffer);
        } catch (e) {}

        passMap[pass] = (passMap[pass] || []);
        passMap[pass].push(r.title);

        const isShort = pass.length < 10;
        const isWeak = !/[A-Z]/.test(pass) || !/[0-9]/.test(pass) || !/[^A-Za-z0-9]/.test(pass);
        const daysOld = Math.floor((Date.now() - new Date(r.password_updated_at).getTime()) / (1000 * 60 * 60 * 24));

        auditResults.push({
          id: r.id,
          title: r.title,
          username: r.username,
          categoryName: r.category_name,
          passLength: pass.length,
          isWeak: isShort || isWeak,
          isOld: daysOld > 90,
          daysOld
        });
      });

      auditResults = auditResults.map(item => {
        let pass = '';
        const r = rows.find(x => x.id === item.id);
        if (r) {
          try { pass = decrypt(r.encrypted_password, r.iv, r.tag, activeSession.keyBuffer); } catch(e){}
        }
        const reuses = passMap[pass] ? passMap[pass].filter(t => t !== item.title) : [];
        return {
          ...item,
          isReused: reuses.length > 0,
          reusedWith: reuses
        };
      });

      res.json(auditResults);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
