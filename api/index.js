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
    res.status(500).json({ message: 'Database initialization failed' });
  }
});

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/jobs', require('../server/routes/jobs'));
app.use('/api/applications', require('../server/routes/applications'));
app.use('/api/resumes', require('../server/routes/resumes'));
app.use('/api/profile', require('../server/routes/profile'));
app.use('/api/notifications', require('../server/routes/notifications'));
app.use('/api/roadmap', require('../server/routes/roadmap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running on Vercel' });
});

module.exports = app;

