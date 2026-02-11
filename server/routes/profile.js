const express = require('express');
const router = express.Router();
const { User, Job } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    await user.update(req.body);
    
    const updated = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get matching jobs based on profile
router.get('/matching-jobs', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    const jobs = await Job.findAll({
      where: {
        isActive: true,
      },
      limit: 10,
      order: [['postedDate', 'DESC']],
    });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
