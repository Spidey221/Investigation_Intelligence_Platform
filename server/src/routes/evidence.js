const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticate);

router.delete('/:id', authorize(['ADMIN']), evidenceController.deleteEvidence);
router.post('/:id/verify', authorize(['ADMIN', 'INVESTIGATOR', 'ANALYST', 'VIEWER']), evidenceController.verifyIntegrity);

module.exports = router;
