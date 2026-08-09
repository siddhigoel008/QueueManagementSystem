const express = require('express');
const Token = require('../models/Token');
const AuditLog = require('../models/AuditLog');
const { verifyToken, requireRole } = require('../middleware/auth');
const { sortByPriority } = require('../utils/queueHelpers');

const router = express.Router();

// Every route below requires a logged-in staff or supervisor
router.use(verifyToken, requireRole('staff', 'supervisor'));

// GET /api/staff/queue/:serviceType - waiting tokens, priority-sorted
router.get('/queue/:serviceType', async (req, res) => {
  try {
    const tokens = await Token.find({ serviceType: req.params.serviceType, status: 'waiting' });
    res.json(sortByPriority(tokens));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff/tokens/:id/call
router.post('/tokens/:id/call', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status: 'called', assignedCounter: req.user.assignedCounter },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });

    req.app.get('io').to(`service:${token.serviceType}`).emit('queueUpdated', { serviceType: token.serviceType });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff/tokens/:id/complete
router.post('/tokens/:id/complete', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    if (!token) return res.status(404).json({ error: 'Token not found' });

    req.app.get('io').to(`service:${token.serviceType}`).emit('queueUpdated', { serviceType: token.serviceType });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff/tokens/:id/skip
// Body: { reason }
router.post('/tokens/:id/skip', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'A reason is required to skip a citizen' });

    const token = await Token.findByIdAndUpdate(req.params.id, { status: 'skipped' }, { new: true });
    if (!token) return res.status(404).json({ error: 'Token not found' });

    await AuditLog.create({
      tokenId: token._id.toString(),
      action: 'manual_skip',
      performedBy: req.user.employeeId,
      reason
    });

    req.app.get('io').to(`service:${token.serviceType}`).emit('queueUpdated', { serviceType: token.serviceType });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff/tokens/:id/priority - the only way a token's priority can change
// Body: { priorityCategory, reason } - both mandatory, always audited
router.post('/tokens/:id/priority', async (req, res) => {
  try {
    const { priorityCategory, reason } = req.body;
    if (!priorityCategory || !reason) {
      return res.status(400).json({ error: 'priorityCategory and reason are both required' });
    }

    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { priorityCategory, priorityVerifiedBy: req.user.employeeId },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });

    await AuditLog.create({
      tokenId: token._id.toString(),
      action: 'priority_change',
      performedBy: req.user.employeeId,
      reason
    });

    req.app.get('io').to(`service:${token.serviceType}`).emit('queueUpdated', { serviceType: token.serviceType });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff/tokens/:id/redirect - move a citizen to a different counter
// Body: { newCounter, reason } - both mandatory, always audited
router.post('/tokens/:id/redirect', async (req, res) => {
  try {
    const { newCounter, reason } = req.body;
    if (!newCounter || !reason) {
      return res.status(400).json({ error: 'newCounter and reason are both required' });
    }

    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { assignedCounter: newCounter, status: 'redirected' },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: 'Token not found' });

    await AuditLog.create({
      tokenId: token._id.toString(),
      action: 'counter_redirect',
      performedBy: req.user.employeeId,
      reason
    });

    req.app.get('io').to(`service:${token.serviceType}`).emit('queueUpdated', { serviceType: token.serviceType });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
