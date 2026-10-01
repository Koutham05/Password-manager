const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./db');
const { initWebSocketServer } = require('./websocket/sync');
const { requireUnlocked } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const passwordsRoutes = require('./routes/passwords');
const extensionRoutes = require('./routes/extension');
const securityRoutes = require('./routes/security');
const backupRoutes = require('./routes/backup');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// In-Memory Vault Key Session Management
let activeSession = {
  unlocked: false,
  keyBuffer: null,
  lastActive: Date.now()
};

// Initialize WebSocket E2E Sync Service with Active Session Reference
initWebSocketServer(server, activeSession);

// CORS Policy Configuration
const allowedOrigins = NODE_ENV === 'production' 
  ? [process.env.CLIENT_ORIGIN || 'http://localhost:5173']
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('chrome-extension://')) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy rejection: Origin not allowed.'));
    }
  },
  credentials: true
}));

// Security HTTP Response Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '10mb' }));

function logAudit(action, target = '') {
  try {
    db.prepare('INSERT INTO audit_logs (action, target) VALUES (?, ?)').run(action, target);
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

const authMiddleware = requireUnlocked(activeSession);

// Mount Modular Express Routes
app.use('/api/auth', authRoutes(activeSession, logAudit));
app.use('/api/passwords', passwordsRoutes(activeSession, authMiddleware, logAudit));
app.use('/api/extension', extensionRoutes(activeSession));
app.use('/api/security', securityRoutes(activeSession, authMiddleware));
app.use('/api', backupRoutes(authMiddleware, logAudit));

// Category, Dashboard, Settings & Log APIs
app.get('/api/dashboard', authMiddleware, (req, res) => {
  try {
    const totalPasswords = db.prepare('SELECT COUNT(*) as count FROM passwords').get().count;
    const favorites = db.prepare('SELECT COUNT(*) as count FROM passwords WHERE is_favorite = 1').get().count;
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;

    const recentItems = db.prepare(`
      SELECT p.id, p.title, p.url, p.username, p.email, p.is_favorite, p.updated_at, c.name as category_name, c.color as category_color 
      FROM passwords p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.updated_at DESC LIMIT 5
    `).all();

    res.json({
      stats: {
        totalPasswords,
        strongCount: Math.round(totalPasswords * 0.6),
        mediumCount: Math.round(totalPasswords * 0.3),
        weakCount: Math.round(totalPasswords * 0.1),
        without2fa: 0,
        favorites,
        categoriesCount,
        reusedCount: 0,
        healthScore: 92
      },
      recentItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', authMiddleware, (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', authMiddleware, (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required.' });

    const result = db.prepare('INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)').run(
      name, icon || 'Folder', color || '#3b82f6'
    );
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', authMiddleware, (req, res) => {
  try {
    const settings = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    Object.keys(settings).forEach(key => {
      stmt.run(key, String(settings[key]));
    });
    logAudit('UPDATE_SETTINGS', 'Updated app configurations');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit-logs', authMiddleware, (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100').all();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`🔐 Aegis Vault API & WebSocket Server running on http://localhost:${PORT}`);
});
