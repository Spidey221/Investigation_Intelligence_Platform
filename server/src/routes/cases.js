const express = require('express');
const router = express.Router();
const casesController = require('../controllers/casesController');
const evidenceController = require('../controllers/evidenceController');

// Cases Routes
router.get('/', casesController.getCases);
router.get('/:id', casesController.getCaseById);
router.post('/', casesController.createCase);
router.put('/:id', casesController.updateCase);
router.delete('/:id', casesController.deleteCase);

// Phase 6 endpoints
router.put('/:id/public', casesController.togglePublicAccess);
router.post('/:id/report', casesController.generateReport);

// Evidence Routes
router.get('/:id/evidence', evidenceController.getEvidenceByCase);
router.post('/:id/evidence', (req, res, next) => {
  evidenceController.upload.single('file')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, evidenceController.createEvidence);

module.exports = router;
