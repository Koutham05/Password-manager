// Simple In-Memory Rate Limiter Middleware for Auth Endpoints
const attemptsMap = new Map();

function rateLimiter(maxAttempts = 5, windowMs = 60000) {
  return function (req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'local';
    const now = Date.now();

    if (!attemptsMap.has(ip)) {
      attemptsMap.set(ip, []);
    }

    const timestamps = attemptsMap.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    attemptsMap.set(ip, timestamps);

    if (timestamps.length > maxAttempts) {
      return res.status(429).json({ error: 'Too many authentication attempts. Please wait 1 minute.' });
    }

    next();
  };
}

module.exports = {
  rateLimiter
};
