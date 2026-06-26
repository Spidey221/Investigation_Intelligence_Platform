const db = require('../db');

const getCaseAuditTimeline = async (req, res) => {
  try {
    const { caseId } = req.params;
    const query = `
      SELECT a.*, u.name as user_name, u.role as user_role 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE (a.resource_type = 'CASE' AND a.resource_id = $1)
         OR (a.resource_type = 'EVIDENCE' AND a.resource_id IN (SELECT id FROM evidence WHERE case_id = $1))
      ORDER BY a.created_at DESC
    `;
    const { rows } = await db.query(query, [caseId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit timeline' });
  }
};

module.exports = {
  getCaseAuditTimeline
};
