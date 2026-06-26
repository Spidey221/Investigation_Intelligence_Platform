const db = require('../db');

/**
 * Log an audit action to the database.
 * @param {number|null} userId - ID of the user performing the action
 * @param {string} action - The action taking place (e.g., CASE_CREATED)
 * @param {string} resourceType - The type of resource (e.g., CASE, EVIDENCE)
 * @param {number|null} resourceId - The ID of the resource
 * @param {string} details - Additional context
 * @param {string} ipAddress - The requester's IP
 */
const logAction = async (userId, action, resourceType, resourceId, details, ipAddress) => {
  try {
    const query = `
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(query, [userId, action, resourceType, resourceId, details, ipAddress]);
  } catch (err) {
    console.error('Failed to log audit action:', err);
  }
};

module.exports = {
  logAction
};
