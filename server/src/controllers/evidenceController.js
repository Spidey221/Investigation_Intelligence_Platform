const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processAndSaveEntities } = require('../services/entityService');
const { generateFileHash } = require('../services/hashService');
const { logAction } = require('../services/auditService');
const logger = require('../config/logger');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files (jpg, jpeg, png, webp) and PDFs are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter
});

/**
 * Retrieve all evidence for a specific case by case ID.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const getEvidenceByCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM evidence WHERE case_id = $1 ORDER BY created_at DESC', [id]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching evidence:', err);
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
};

/**
 * Create a new evidence item with optional file upload handling.
 * @param {import('express').Request} req - Express request object containing body and optional file
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const createEvidence = async (req, res) => {
  try {
    const caseId = req.params.id;
    const { title, type, content } = req.body;
    let filePath = null;
    let originalFilename = null;
    let fileHash = null;

    if (req.file) {
      filePath = path.join('uploads', req.file.filename);
      originalFilename = req.file.originalname;
      // Generate SHA-256 hash
      fileHash = await generateFileHash(req.file.path);
    }

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    const query = `
      INSERT INTO evidence (case_id, title, type, content, file_path, original_filename, file_hash, uploaded_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    const values = [caseId, title, type, content || null, filePath, originalFilename, fileHash, req.user ? req.user.id : null];

    const { rows } = await db.query(query, values);
    const savedEvidence = rows[0];

    // Log the upload
    if (req.user) {
      await logAction(req.user.id, 'EVIDENCE_UPLOADED', 'EVIDENCE', savedEvidence.id, `Uploaded ${type}: ${title}`, req.ip);
    }

    // Trigger synchronous entity extraction
    if (content) {
      await processAndSaveEntities(caseId, savedEvidence.id, content);
    }

    res.status(201).json(savedEvidence);
  } catch (err) {
    console.error('Error creating evidence:', err);
    res.status(500).json({ error: err.message || 'Failed to create evidence' });
  }
};

/**
 * Delete a specific evidence item and remove its associated file from local storage if applicable.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const deleteEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM evidence WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    
    const evidence = rows[0];
    
    // Log deletion
    if (req.user) {
      await logAction(req.user.id, 'EVIDENCE_DELETED', 'EVIDENCE', id, `Deleted evidence: ${evidence.title}`, req.ip);
    }

    if (evidence.file_path) {
      const fullPath = path.join(__dirname, '../../', evidence.file_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await db.query('DELETE FROM evidence WHERE id = $1', [id]);
    res.json({ message: 'Evidence deleted successfully' });
  } catch (err) {
    console.error('Error deleting evidence:', err);
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
};

/**
 * Verify integrity of an evidence file via hash comparison.
 */
const verifyIntegrity = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT file_path, file_hash FROM evidence WHERE id = $1', [id]);
    
    if (rows.length === 0) return res.status(404).json({ error: 'Evidence not found' });
    const evidence = rows[0];

    if (!evidence.file_path || !evidence.file_hash) {
      return res.json({ valid: null, message: 'No file or hash found for this evidence' });
    }

    // Ensure the path is absolute or resolved properly from the root
    const absolutePath = path.resolve(__dirname, '../../', evidence.file_path);
    const currentHash = await generateFileHash(absolutePath);

    const isValid = currentHash === evidence.file_hash;
    
    if (!isValid) {
      logger.warn(`INTEGRITY_FAILURE: Evidence ID ${id} failed hash verification.`);
    }

    if (req.user) {
      await logAction(req.user.id, 'INTEGRITY_VERIFICATION', 'EVIDENCE', id, `Verified integrity. Result: ${isValid ? 'Verified' : 'Compromised'}`, req.ip);
    }

    res.json({ valid: isValid });
  } catch (err) {
    console.error('Integrity verification failed:', err);
    res.status(500).json({ error: 'Integrity check failed' });
  }
};

module.exports = {
  upload,
  getEvidenceByCase,
  createEvidence,
  deleteEvidence,
  verifyIntegrity
};
