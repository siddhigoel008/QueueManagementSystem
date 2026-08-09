const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/login
// Body: { employeeId, password }
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const user = await User.findOne({ employeeId });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { employeeId: user.employeeId, role: user.role, assignedCounter: user.assignedCounter },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      name: user.name,
      role: user.role,
      assignedCounter: user.assignedCounter
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
