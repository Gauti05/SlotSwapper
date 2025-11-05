
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', user: { $ne: req.user } }).populate('user', 'name');
    res.json(slots);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
