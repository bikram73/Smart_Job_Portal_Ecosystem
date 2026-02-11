const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { auth } = require('../middleware/auth');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    
    const transformed = notifications.map(n => ({
      _id: n.id,
      ...n.toJSON(),
    }));
    
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await notification.update({ read: true });
    res.json({ _id: notification.id, ...notification.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.userId, read: false } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
