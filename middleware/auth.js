const jwt = require('jsonwebtoken');

// Checks that a valid JWT was sent in the Authorization header.
// Usage: router.use(verifyToken)
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { employeeId, role, assignedCounter }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Checks the logged-in user has one of the allowed roles.
// Usage: router.use(requireRole('staff', 'supervisor'))
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized for this action' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
