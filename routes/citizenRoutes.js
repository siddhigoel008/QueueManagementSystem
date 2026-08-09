const express = require('express');
const ServiceType = require('../models/ServiceType');
const Token = require('../models/Token');
const { generateTokenNumber, sortByPriority, calculateEstimatedWait } = require('../utils/queueHelpers');

const router = express.Router();

// GET /api/services - list all departments (Member 2 uses this for the service selection screen)
router.get('/services', async (req, res) => {
  try {
    const services = await ServiceType.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tokens - citizen joins a queue
// Body: { serviceType, citizenName }
router.post('/tokens', async (req, res) => {
  try {
    const { serviceType, citizenName } = req.body;
    if (!serviceType || !citizenName) {
      return res.status(400).json({ error: 'serviceType and citizenName are required' });
    }

    const service = await ServiceType.findOne({ code: serviceType });
    if (!service) return res.status(404).json({ error: 'Service type not found' });

    const tokenNumber = await generateTokenNumber(Token, serviceType);
    const waitingAhead = await Token.countDocuments({ serviceType, status: 'waiting' });
    const estimatedWait = calculateEstimatedWait(waitingAhead, service.avgServiceTimeMinutes);

    const newToken = await Token.create({
      tokenNumber,
      serviceType,
      citizenName,
      priorityCategory: 'normal', // hardcoded on purpose - see models/Token.js comment
      estimatedWait
    });

    // Tell anyone watching this service's queue (staff dashboard, display board) that it changed
    req.app.get('io').to(`service:${serviceType}`).emit('queueUpdated', { serviceType });

    res.status(201).json(newToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tokens/:id/status - live position + wait time (Member 2's polling/live screen)
router.get('/tokens/:id/status', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    const service = await ServiceType.findOne({ code: token.serviceType });
    const waitingTokens = await Token.find({ serviceType: token.serviceType, status: 'waiting' });
    const sorted = sortByPriority(waitingTokens);

    const position = sorted.findIndex((t) => t._id.toString() === token._id.toString());
    const peopleAhead = position === -1 ? 0 : position;
    const estimatedWait = calculateEstimatedWait(peopleAhead, service.avgServiceTimeMinutes);

    res.json({
      tokenNumber: token.tokenNumber,
      status: token.status,
      peopleAhead,
      estimatedWait
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
