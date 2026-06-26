const db = require('../db');
const { getCaseRelationships, buildGraph } = require('../services/relationshipService');

/**
 * Middleware or utility to retrieve case by share token
 */
const getCaseByToken = async (shareToken) => {
  const query = 'SELECT * FROM cases WHERE share_token = $1 AND is_public = true';
  const { rows } = await db.query(query, [shareToken]);
  if (rows.length === 0) throw new Error('Shared case not found or is private');
  return rows[0];
};

const getSharedCase = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const caseData = await getCaseByToken(shareToken);
    res.json(caseData);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const getSharedEvidence = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const caseData = await getCaseByToken(shareToken);
    const { rows } = await db.query('SELECT * FROM evidence WHERE case_id = $1 ORDER BY created_at DESC', [caseData.id]);
    res.json(rows);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const getSharedEntities = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const caseData = await getCaseByToken(shareToken);
    const query = `
      SELECT e.*, ev.title as evidence_title 
      FROM entities e
      JOIN evidence ev ON e.evidence_id = ev.id
      WHERE e.case_id = $1
      ORDER BY e.created_at DESC
    `;
    const { rows } = await db.query(query, [caseData.id]);
    res.json(rows);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const getSharedRelationships = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const caseData = await getCaseByToken(shareToken);
    const data = await getCaseRelationships(caseData.id);
    res.json(data);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const getSharedGraph = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const caseData = await getCaseByToken(shareToken);
    const data = await buildGraph(caseData.id);
    res.json(data);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  getSharedCase,
  getSharedEvidence,
  getSharedEntities,
  getSharedRelationships,
  getSharedGraph
};
