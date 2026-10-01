const express = require('express');
const router = express.Router();
const db = require('../db');
const { decrypt } = require('../encryption/crypto');

function extractHostname(urlString) {
  try {
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }
    return new URL(urlString).hostname.toLowerCase().replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

module.exports = function (activeSession) {
  router.get('/match', (req, res) => {
    if (!activeSession.unlocked || !activeSession.keyBuffer) {
      return res.status(401).json({ error: 'Vault is locked.' });
    }

    const { domain } = req.query;
    if (!domain) return res.json([]);

    const requestDomain = domain.toLowerCase().replace(/^www\./, '').trim();
    if (!requestDomain) return res.json([]);

    const rows = db.prepare('SELECT * FROM passwords').all();

    const matches = rows.filter(r => {
      if (!r.url) return false;
      const recordHost = extractHostname(r.url);
      if (!recordHost) return false;

      // Strict Domain Matching: Prevent false positives like evil-github.com or github.com.attacker.com matching github.com
      return recordHost === requestDomain || recordHost.endsWith('.' + requestDomain);
    }).map(r => {
      let decryptedPassword = '';
      try {
        decryptedPassword = decrypt(r.encrypted_password, r.iv, r.tag, activeSession.keyBuffer);
      } catch (e) {}
      return {
        id: r.id,
        title: r.title,
        username: r.username,
        email: r.email,
        password: decryptedPassword,
        url: r.url
      };
    });

    res.json(matches);
  });

  return router;
};
