const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  counterNumber: { type: String, required: true, unique: true }, // "INC-1"
  serviceType: { type: String, required: true }, // links to ServiceType.code
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  currentStaff: { type: String, default: null } // employeeId of staff manning it
});

module.exports = mongoose.model('Counter', counterSchema);
