const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, and password.' });
    }

    // Strong password validation
    if (password.length < 12) {
      return res.status(400).json({ message: 'Password must be at least 12 characters long.' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character (!@#$%^&* etc.).' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please sign in instead.' });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'my_super_secret_jwt_key_change_in_production_12345', {
      expiresIn: '7d',
    });

    console.log('User registered:', user.id);
    console.log('Token created with userId:', user.id);

    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        experience: user.experience,
        preferredRoles: user.preferredRoles,
        preferredLocations: user.preferredLocations,
        profileComplete: user.profileComplete,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'User does not exist. Please register first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'my_super_secret_jwt_key_change_in_production_12345', {
      expiresIn: '7d',
    });

    console.log('User logged in:', user.id);
    console.log('Token created with userId:', user.id);

    res.json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        experience: user.experience,
        preferredRoles: user.preferredRoles,
        preferredLocations: user.preferredLocations,
        profileComplete: user.profileComplete,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
