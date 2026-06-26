const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_iip');
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
