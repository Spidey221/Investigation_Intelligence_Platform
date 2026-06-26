const db = require('../db');

/**
 * Retrieve all entities for a specific case.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const getEntitiesByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const query = `
      SELECT e.*, ev.title as evidence_title 
      FROM entities e
      JOIN evidence ev ON e.evidence_id = ev.id
      WHERE e.case_id = $1
      ORDER BY e.created_at DESC
    `;
    const { rows } = await db.query(query, [caseId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching entities for case:', err);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
};

/**
 * Retrieve all entities for a specific piece of evidence.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const getEntitiesByEvidence = async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const { rows } = await db.query('SELECT * FROM entities WHERE evidence_id = $1 ORDER BY created_at DESC', [evidenceId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching entities for evidence:', err);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
};

module.exports = {
  getEntitiesByCase,
  getEntitiesByEvidence
};
