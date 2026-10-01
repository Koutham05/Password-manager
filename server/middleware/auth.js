// Auth Middleware
function requireUnlocked(activeSession) {
  return function (req, res, next) {
    if (!activeSession.unlocked || !activeSession.keyBuffer) {
      return res.status(401).json({ error: 'Vault is locked. Authentication required.' });
    }
    activeSession.lastActive = Date.now();
    next();
  };
}

module.exports = {
  requireUnlocked
};
