const express = require('express');
const Token = require('../models/Token');
const Counter = require('../models/Counter');
const AuditLog = require('../models/AuditLog');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, requireRole('supervisor'));

// GET /api/supervisor/overview - all counters with live queue lengths, flags overloaded ones
router.get('/overview', async (req, res) => {
  try {
    const counters = await Counter.find();

    const overview = await Promise.all(
      counters.map(async (counter) => {
        const waitingCount = await Token.countDocuments({
          serviceType: counter.serviceType,
          status: 'waiting'
        });
        return {
          counterNumber: counter.counterNumber,
          serviceType: counter.serviceType,
          status: counter.status,
          waitingCount,
          overloaded: waitingCount > 10
        };
      })
    );

    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/supervisor/audit/:tokenId - full history of manual changes for one token
router.get('/audit/:tokenId', async (req, res) => {
  try {
    const logs = await AuditLog.find({ tokenId: req.params.tokenId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
