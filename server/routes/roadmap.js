const express = require('express');
const router = express.Router();
const { Job } = require('../models');
const { auth } = require('../middleware/auth');

// Get learning roadmap for a job
router.get('/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const roadmap = {
      role: job.title,
      skills: job.skills.map(skill => ({
        name: skill,
        category: 'Technical',
        priority: 'High',
        status: 'Not Started',
      })),
      resources: [
        {
          title: `${job.title} Complete Guide`,
          type: 'Course',
          url: '#',
          duration: '40 hours',
        },
        {
          title: 'Interview Preparation',
          type: 'Article',
          url: '#',
        },
      ],
      timeline: '3-6 months',
      interviewPrep: {
        topics: job.requirements.slice(0, 5),
        commonQuestions: [
          'Tell me about yourself',
          'Why do you want this role?',
          'Describe a challenging project',
        ],
        codingProblems: [
          'Array manipulation',
          'String algorithms',
          'Data structures',
        ],
      },
    };

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
