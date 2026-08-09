const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // "INC", "BIRTH", "WELFARE"
  name: { type: String, required: true }, // "Income/Domicile Certificate"
  avgServiceTimeMinutes: { type: Number, required: true, default: 5 }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);
