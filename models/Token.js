const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, required: true, unique: true }, // "INC-014"
    serviceType: { type: String, required: true },
    citizenName: { type: String, required: true },

    // IMPORTANT: citizens can never set this themselves. The citizen-facing
    // route always hardcodes "normal". Only the staff /priority endpoint
    // (which requires a reason and writes an AuditLog) can change it.
    priorityCategory: {
      type: String,
      enum: ['normal', 'senior_disability', 'pregnant', 'time_sensitive'],
      default: 'normal'
    },
    priorityVerifiedBy: { type: String, default: null }, // employeeId, null if still "normal"

    assignedCounter: { type: String, default: null },

    status: {
      type: String,
      enum: ['waiting', 'called', 'serving', 'completed', 'skipped', 'redirected'],
      default: 'waiting'
    },

    estimatedWait: { type: Number, default: 0 } // in minutes
  },
  { timestamps: true } // gives us createdAt automatically
);

module.exports = mongoose.model('Token', tokenSchema);
