const express = require('express');
const router = express.Router();
const { getRelationships, getGraph } = require('../controllers/relationshipsController');

router.get('/cases/:caseId/relationships', getRelationships);
router.get('/cases/:caseId/graph', getGraph);

module.exports = router;
