const express = require('express');
const router = express.Router();
const casesController = require('../controllers/casesController');
const evidenceController = require('../controllers/evidenceController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/', casesController.getCases);
router.get('/:id', casesController.getCaseById);

router.post('/', authorize(['ADMIN', 'INVESTIGATOR']), casesController.createCase);
router.put('/:id', authorize(['ADMIN', 'INVESTIGATOR']), casesController.updateCase);
router.delete('/:id', authorize(['ADMIN']), casesController.deleteCase);

// Phase 6 endpoints
router.put('/:id/public', authorize(['ADMIN', 'INVESTIGATOR']), casesController.togglePublicAccess);
router.post('/:id/report', authorize(['ADMIN', 'INVESTIGATOR', 'ANALYST']), casesController.generateReport);

// Evidence Routes
router.get('/:id/evidence', evidenceController.getEvidenceByCase);
router.post('/:id/evidence', authorize(['ADMIN', 'INVESTIGATOR']), evidenceController.upload.single('file'), evidenceController.createEvidence);

module.exports = router;
