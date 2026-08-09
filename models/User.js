const mongoose = require('mongoose');

// Citizens do NOT get accounts in this system (matches the "no app download" design).
// Only Counter Staff and Office Supervisors log in.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored hashed, never plain text
    role: { type: String, enum: ['staff', 'supervisor'], required: true },
    assignedCounter: { type: String, default: null } // e.g. "INC-1", only relevant for staff
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
