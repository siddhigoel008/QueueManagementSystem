const express = require('express');
const Token = require('../models/Token');

const router = express.Router();

// GET /api/display/:serviceType - shows currently-called/serving tokens for the public screen
router.get('/:serviceType', async (req, res) => {
  try {
    const currentlyServing = await Token.find({
      serviceType: req.params.serviceType,
      status: { $in: ['called', 'serving'] }
    }).sort({ updatedAt: -1 });

    res.json(currentlyServing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
