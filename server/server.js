const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/roadmap', require('./routes/roadmap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(async () => {
  // Seed sample jobs on first run
  const { Job } = require('./models');
  const { seedJobs } = require('./seedData');
  
  const jobCount = await Job.count();
  if (jobCount === 0) {
    console.log('No jobs found, seeding sample data...');
    await seedJobs();
  }
  
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Frontend should connect to http://localhost:3000`);
    console.log(`✓ Database: SQLite (database.sqlite)`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
