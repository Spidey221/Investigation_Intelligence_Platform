const express = require('express');
const router = express.Router();
const { 
  getSharedCase, 
  getSharedEvidence, 
  getSharedEntities, 
  getSharedRelationships, 
  getSharedGraph 
} = require('../controllers/sharedController');

router.get('/:shareToken', getSharedCase);
router.get('/:shareToken/evidence', getSharedEvidence);
router.get('/:shareToken/entities', getSharedEntities);
router.get('/:shareToken/relationships', getSharedRelationships);
router.get('/:shareToken/graph', getSharedGraph);

module.exports = router;
