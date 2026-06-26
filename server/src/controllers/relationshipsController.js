const { getCaseRelationships, buildGraph } = require('../services/relationshipService');

const getRelationships = async (req, res) => {
  try {
    const { caseId } = req.params;
    const data = await getCaseRelationships(caseId);
    res.json(data);
  } catch (err) {
    console.error('Error fetching relationships:', err);
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
};

const getGraph = async (req, res) => {
  try {
    const { caseId } = req.params;
    const data = await buildGraph(caseId);
    res.json(data);
  } catch (err) {
    console.error('Error building graph:', err);
    res.status(500).json({ error: 'Failed to build graph' });
  }
};

module.exports = {
  getRelationships,
  getGraph
};
