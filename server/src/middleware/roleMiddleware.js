const logger = require('../config/logger');

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`RBAC_DENIED: User ${req.user ? req.user.email : 'Unknown'} attempted to access ${req.originalUrl}. Required: ${roles.join(', ')}`);
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

module.exports = authorize;
