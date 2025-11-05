
const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');
const auth = require('../middleware/auth');


router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'Missing slot IDs' });

  try {
    const mySlot = await Event.findOne({ _id: mySlotId, user: req.user, status: 'SWAPPABLE' });
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Slots not available for swapping' });
    }

    if (String(theirSlot.user) === req.user) {
      return res.status(400).json({ message: 'Cannot swap with your own slot' });
    }

    const session = await SwapRequest.startSession();
    session.startTransaction();

    const swapRequest = new SwapRequest({
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      requester: req.user,
      requestee: theirSlot.user,
    });

    await swapRequest.save({ session });
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(swapRequest);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/swap-requests', auth, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ requestee: req.user, status: 'PENDING' }).populate('mySlot theirSlot');
    const outgoing = await SwapRequest.find({ requester: req.user, status: 'PENDING' }).populate('mySlot theirSlot');
    res.json({ incoming, outgoing });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/swap-response/:id', auth, async (req, res) => {
  const { accept } = req.body;
  try {
    const swapRequest = await SwapRequest.findById(req.params.id).populate('mySlot theirSlot requester requestee');
    if (!swapRequest || swapRequest.status !== 'PENDING') {
      return res.status(404).json({ message: 'Swap request not found or resolved' });
    }
    if (String(swapRequest.requestee._id) !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!accept) {
      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      swapRequest.mySlot.status = 'SWAPPABLE';
      swapRequest.theirSlot.status = 'SWAPPABLE';
      await swapRequest.mySlot.save();
      await swapRequest.theirSlot.save();

      return res.json({ message: 'Swap request rejected' });
    }

    const session = await SwapRequest.startSession();
    session.startTransaction();

    const tempOwner = swapRequest.mySlot.user;
    swapRequest.mySlot.user = swapRequest.theirSlot.user;
    swapRequest.theirSlot.user = tempOwner;

    swapRequest.mySlot.status = 'BUSY';
    swapRequest.theirSlot.status = 'BUSY';

    swapRequest.status = 'ACCEPTED';

    await swapRequest.mySlot.save({ session });
    await swapRequest.theirSlot.save({ session });
    await swapRequest.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Swap request accepted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
