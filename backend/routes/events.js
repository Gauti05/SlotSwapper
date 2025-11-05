
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { title, startTime, endTime, status } = req.body;
    const event = new Event({ title, startTime, endTime, status, user: req.user });
    await event.save();
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user });
    res.json(events);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event status
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.body.status) event.status = req.body.status;
    await event.save();
    res.json(event);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my-swappable', auth, async (req, res) => {
  try {
    const slots = await Event.find({ user: req.user, status: 'SWAPPABLE' });
    res.json(slots);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
