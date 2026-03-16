const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Restrict CORS to trusted origin only
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://aminsassi.github.io';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF token store (in-memory, simple)
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

// CSRF middleware for state-changing routes
function csrfProtect(req, res, next) {
  const token = req.headers['x-csrf-token'];
  if (!verifyCsrfToken(token)) {
    return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token' });
  }
  next();
}

// API key auth middleware
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

// Sample data (in a real app, this would come from a database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

// Routes

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// GET /api/users/:id - Get a specific user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// GET /api/csrf-token - Issue a CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: generateCsrfToken() });
});

// POST /api/users - Create a new user
app.post('/api/users', requireAuth, csrfProtect, (req, res) => {
  const { name, email } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

// PUT /api/users/:id - Update a user
app.put('/api/users/:id', requireAuth, csrfProtect, (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Update user
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'User updated successfully'
  });
});

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', requireAuth, csrfProtect, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: 'User deleted successfully'
  });
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Express REST API',
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler - moved to the end, after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;