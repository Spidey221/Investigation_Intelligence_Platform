const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authenticate = require('../middleware/authMiddleware');

router.get('/case/:caseId', authenticate, auditController.getCaseAuditTimeline);

module.exports = router;
