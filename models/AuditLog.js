const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  action: {
    type: String,
    enum: ['priority_change', 'counter_redirect', 'manual_skip'],
    required: true
  },
  performedBy: { type: String, required: true }, // employeeId of staff/supervisor
  reason: { type: String, required: true }, // mandatory - enforced in the route, not just here
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
