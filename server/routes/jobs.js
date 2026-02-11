const express = require('express');
const router = express.Router();
const { Job } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all jobs with filters
router.get('/', auth, async (req, res) => {
  try {
    const { search, location, jobType, experience, limit = 20, page = 1 } = req.query;
    
    const where = { isActive: true };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }
    
    if (jobType) {
      where.jobType = jobType;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await Job.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['postedDate', 'DESC']],
    });

    // Transform data to match frontend expectations
    const jobs = rows.map(job => ({
      _id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: {
        min: job.salaryMin || 0,
        max: job.salaryMax || 0,
        currency: job.salaryCurrency,
      },
      experience: {
        min: job.experienceMin || 0,
        max: job.experienceMax || 0,
      },
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      jobType: job.jobType,
      source: job.source,
      sourceUrl: job.sourceUrl,
      postedDate: job.postedDate,
      isActive: job.isActive,
    }));

    res.json({
      jobs,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get job by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Transform to match frontend
    const jobData = {
      _id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: {
        min: job.salaryMin || 0,
        max: job.salaryMax || 0,
        currency: job.salaryCurrency,
      },
      experience: {
        min: job.experienceMin || 0,
        max: job.experienceMax || 0,
      },
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      jobType: job.jobType,
      source: job.source,
      sourceUrl: job.sourceUrl,
      postedDate: job.postedDate,
      isActive: job.isActive,
    };
    
    res.json(jobData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job (admin/scraper)
router.post('/', async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      salaryMin: req.body.salary?.min,
      salaryMax: req.body.salary?.max,
      salaryCurrency: req.body.salary?.currency || 'INR',
      experienceMin: req.body.experience?.min,
      experienceMax: req.body.experience?.max,
      description: req.body.description,
      requirements: req.body.requirements,
      skills: req.body.skills,
      jobType: req.body.jobType,
      source: req.body.source,
      sourceUrl: req.body.sourceUrl,
      postedDate: req.body.postedDate || new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };
    
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
