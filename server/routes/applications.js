const express = require('express');
const router = express.Router();
const { Application, Job } = require('../models');
const { auth } = require('../middleware/auth');

// Get user applications
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.userId },
      include: [{ model: Job }],
      order: [['createdAt', 'DESC']],
    });
    
    // Transform to match frontend expectations
    const transformedApps = applications.map(app => ({
      _id: app.id,
      userId: app.userId,
      jobId: {
        _id: app.Job.id,
        title: app.Job.title,
        company: app.Job.company,
        location: app.Job.location,
        jobType: app.Job.jobType,
      },
      status: app.status,
      appliedDate: app.appliedDate,
      notes: app.notes,
      resumeUsed: app.resumeUsed,
      matchScore: app.matchScore,
      skillGaps: app.skillGaps,
      timeline: app.timeline,
      createdAt: app.createdAt,
    }));
    
    res.json(transformedApps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create application
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== Creating Application ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    
    const { jobId, status, appliedDate, notes, matchScore, skillGaps } = req.body;
    
    // Convert jobId to integer
    const jobIdInt = parseInt(jobId);
    
    if (isNaN(jobIdInt)) {
      console.error('Invalid job ID:', jobId);
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    
    console.log('Looking for job with ID:', jobIdInt);
    
    // Check if job exists
    const job = await Job.findByPk(jobIdInt);
    if (!job) {
      console.error('Job not found:', jobIdInt);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    console.log('Job found:', job.title);
    
    // Check if application already exists
    const existingApp = await Application.findOne({
      where: { userId: req.userId, jobId: jobIdInt }
    });
    
    if (existingApp) {
      console.log('Application already exists');
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    console.log('Creating new application...');
    
    const application = await Application.create({
      userId: req.userId,
      jobId: jobIdInt,
      status: status || 'Saved',
      appliedDate: appliedDate || (status === 'Applied' ? new Date() : null),
      notes: notes || '',
      matchScore: matchScore || 0,
      skillGaps: skillGaps || [],
      timeline: [{ 
        status: status || 'Saved', 
        date: new Date(),
        note: 'Application created'
      }],
    });
    
    console.log('Application created with ID:', application.id);
    
    const appWithJob = await Application.findByPk(application.id, {
      include: [{ model: Job }],
    });
    
    console.log('Sending response...');
    
    res.status(201).json({
      _id: appWithJob.id,
      userId: appWithJob.userId,
      jobId: {
        _id: appWithJob.Job.id,
        title: appWithJob.Job.title,
        company: appWithJob.Job.company,
        location: appWithJob.Job.location,
        jobType: appWithJob.Job.jobType,
      },
      status: appWithJob.status,
      appliedDate: appWithJob.appliedDate,
      notes: appWithJob.notes,
      matchScore: appWithJob.matchScore,
      skillGaps: appWithJob.skillGaps,
      timeline: appWithJob.timeline,
      createdAt: appWithJob.createdAt,
    });
  } catch (error) {
    console.error('=== Application Creation Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create application. Please try again.', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update application
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update timeline if status changed
    if (req.body.status && req.body.status !== application.status) {
      const timeline = application.timeline || [];
      timeline.push({
        status: req.body.status,
        date: new Date(),
        note: req.body.note || '',
      });
      req.body.timeline = timeline;
    }
    
    await application.update(req.body);
    
    const updated = await Application.findByPk(application.id, {
      include: [{ model: Job }],
    });
    
    res.json({
      _id: updated.id,
      userId: updated.userId,
      jobId: {
        _id: updated.Job.id,
        title: updated.Job.title,
        company: updated.Job.company,
        location: updated.Job.location,
      },
      status: updated.status,
      appliedDate: updated.appliedDate,
      notes: updated.notes,
      timeline: updated.timeline,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    await application.destroy();
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get application stats
router.get('/stats', auth, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.userId },
    });
    
    const stats = {
      totalApplications: applications.length,
      appliedJobs: applications.filter(a => a.status === 'Applied').length,
      savedJobs: applications.filter(a => a.status === 'Saved').length,
      interviewsScheduled: applications.filter(a => a.status === 'Interview').length,
      successRate: applications.length > 0 
        ? Math.round((applications.filter(a => a.status === 'Selected').length / applications.length) * 100)
        : 0,
      avgMatchScore: applications.length > 0
        ? Math.round(applications.reduce((sum, a) => sum + (a.matchScore || 0), 0) / applications.length)
        : 0,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
