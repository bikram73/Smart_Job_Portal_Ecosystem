// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import database connection
const { connectDB } = require('../server/config/database');

// Initialize database connection
let dbInitialized = false;

async function initDB() {
  if (!dbInitialized) {
    await connectDB();
    
    // Seed sample jobs on first run
    const { Job } = require('../server/models');
    const { seedJobs } = require('../server/seedData');
    
    const jobCount = await Job.count();
    if (jobCount === 0) {
      console.log('No jobs found, seeding sample data...');
      await seedJobs();
    }
    
    dbInitialized = true;
  }
}

// Middleware to initialize DB before each request
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      message: 'Database initialization failed', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes - Vercel forwards /api/* to this function, so we need /api prefix
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/jobs', require('../server/routes/jobs'));
app.use('/api/applications', require('../server/routes/applications'));
app.use('/api/resumes', require('../server/routes/resumes'));
app.use('/api/profile', require('../server/routes/profile'));
app.use('/api/notifications', require('../server/routes/notifications'));
app.use('/api/roadmap', require('../server/routes/roadmap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running on Vercel', timestamp: new Date().toISOString() });
});

// Root endpoint for testing
app.get('/api', (req, res) => {
  res.json({ message: 'API is running', endpoints: ['/api/health', '/api/auth/register', '/api/auth/login'] });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message,
    path: req.path
  });
});

module.exports = app;

