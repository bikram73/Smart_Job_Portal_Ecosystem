const express = require('express');
const router = express.Router();
const { Resume } = require('../models');
const { auth } = require('../middleware/auth');

// Get user resumes
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.userId },
      order: [['updatedAt', 'DESC']],
    });
    
    const transformed = resumes.map(r => ({
      _id: r.id,
      ...r.toJSON(),
    }));
    
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get resume by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json({ _id: resume.id, ...resume.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create resume
router.post('/', auth, async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      userId: req.userId,
    });
    
    res.status(201).json({ _id: resume.id, ...resume.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    await resume.update(req.body);
    res.json({ _id: resume.id, ...resume.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    await resume.destroy();
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analyze resume for ATS score
router.post('/analyze', auth, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    let score = 0;
    const keywords = jobDescription.toLowerCase().split(/\s+/);
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    keywords.forEach(keyword => {
      if (resumeText.includes(keyword)) score += 1;
    });
    
    const atsScore = Math.min(Math.round((score / keywords.length) * 100), 100);
    
    res.json({
      atsScore,
      suggestions: [
        'Add more relevant keywords from job description',
        'Include quantifiable achievements',
        'Use action verbs',
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
