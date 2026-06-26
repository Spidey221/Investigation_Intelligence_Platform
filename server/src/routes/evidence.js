const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');

router.delete('/:id', evidenceController.deleteEvidence);

module.exports = router;
