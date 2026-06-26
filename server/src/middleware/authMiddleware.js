const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      logger.warn(`UNAUTHORIZED_ACCESS: Missing token for ${req.originalUrl} from ${req.ip}`);
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_iip');
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    logger.warn(`UNAUTHORIZED_ACCESS: Invalid token for ${req.originalUrl} from ${req.ip}`);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
