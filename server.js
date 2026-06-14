const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://aminsassi.github.io';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function generateId() {
  return crypto.randomBytes(6).toString('hex');
}

// CSRF
const csrfTokens = new Set();
function generateCsrfToken() {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.add(token);
  return token;
}
function verifyCsrfToken(token) {
  if (!token || !csrfTokens.has(token)) return false;
  csrfTokens.delete(token);
  return true;
}
function csrfProtect(req, res, next) {
  const token = req.headers['x-csrf-token'];
  if (!verifyCsrfToken(token)) {
    return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token' });
  }
  next();
}

// Session store
const sessions = new Set();
function generateSession() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.add(token);
  return token;
}
function requireAdmin(req, res, next) {
  const session = req.headers['x-admin-session'];
  if (!session || !sessions.has(session)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

// Public: serve portfolio data
app.get('/api/portfolio', (req, res) => {
  try {
    const data = readData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load portfolio data' });
  }
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: generateCsrfToken() });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Wrong password' });
  }
  const session = generateSession();
  res.json({ success: true, session });
});

// Admin logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const session = req.headers['x-admin-session'];
  sessions.delete(session);
  res.json({ success: true });
});

// Admin: get all data
app.get('/api/admin/data', requireAdmin, (req, res) => {
  try {
    const data = readData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load data' });
  }
});

// Admin: update hero
app.put('/api/admin/hero', requireAdmin, (req, res) => {
  const data = readData();
  data.hero = { ...data.hero, ...req.body };
  writeData(data);
  res.json({ success: true, data: data.hero });
});

// Admin: update stats
app.put('/api/admin/stats', requireAdmin, (req, res) => {
  const data = readData();
  data.stats = req.body.stats;
  writeData(data);
  res.json({ success: true, data: data.stats });
});

// Admin: update about
app.put('/api/admin/about', requireAdmin, (req, res) => {
  const data = readData();
  data.about = { ...data.about, ...req.body };
  writeData(data);
  res.json({ success: true, data: data.about });
});

// Admin: update youtube
app.put('/api/admin/youtube', requireAdmin, (req, res) => {
  const data = readData();
  data.youtube = { ...data.youtube, ...req.body };
  writeData(data);
  res.json({ success: true, data: data.youtube });
});

// Admin: update social
app.put('/api/admin/social', requireAdmin, (req, res) => {
  const data = readData();
  data.social = req.body.social;
  writeData(data);
  res.json({ success: true, data: data.social });
});

// Admin: update contact
app.put('/api/admin/contact', requireAdmin, (req, res) => {
  const data = readData();
  data.contact = { ...data.contact, ...req.body };
  writeData(data);
  res.json({ success: true, data: data.contact });
});

// Admin: portfolio CRUD
app.post('/api/admin/portfolio', requireAdmin, (req, res) => {
  const data = readData();
  const item = { id: generateId(), ...req.body };
  data.portfolio.push(item);
  writeData(data);
  res.status(201).json({ success: true, data: item });
});

app.put('/api/admin/portfolio/:id', requireAdmin, (req, res) => {
  const data = readData();
  const idx = data.portfolio.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  data.portfolio[idx] = { ...data.portfolio[idx], ...req.body, id: req.params.id };
  writeData(data);
  res.json({ success: true, data: data.portfolio[idx] });
});

app.delete('/api/admin/portfolio/:id', requireAdmin, (req, res) => {
  const data = readData();
  const idx = data.portfolio.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  data.portfolio.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

// Admin: reorder portfolio
app.put('/api/admin/portfolio-reorder', requireAdmin, (req, res) => {
  const data = readData();
  data.portfolio = req.body.portfolio;
  writeData(data);
  res.json({ success: true });
});

// Admin: feedback CRUD
app.post('/api/admin/feedback', requireAdmin, (req, res) => {
  const data = readData();
  const item = { id: generateId(), ...req.body };
  data.feedback.push(item);
  writeData(data);
  res.status(201).json({ success: true, data: item });
});

app.put('/api/admin/feedback/:id', requireAdmin, (req, res) => {
  const data = readData();
  const idx = data.feedback.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  data.feedback[idx] = { ...data.feedback[idx], ...req.body, id: req.params.id };
  writeData(data);
  res.json({ success: true, data: data.feedback[idx] });
});

app.delete('/api/admin/feedback/:id', requireAdmin, (req, res) => {
  const data = readData();
  const idx = data.feedback.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  data.feedback.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard at http://localhost:${PORT}/admin.html`);
});

module.exports = app;
