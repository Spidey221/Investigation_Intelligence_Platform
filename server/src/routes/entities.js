const express = require('express');
const router = express.Router();
const { getEntitiesByCase, getEntitiesByEvidence } = require('../controllers/entitiesController');

router.get('/cases/:caseId/entities', getEntitiesByCase);
router.get('/evidence/:evidenceId/entities', getEntitiesByEvidence);

module.exports = router;
