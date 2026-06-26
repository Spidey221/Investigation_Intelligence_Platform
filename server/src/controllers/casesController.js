const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { generateInvestigationReport } = require('../services/reportService');

/**
 * Retrieve all cases ordered by creation date descending.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const getCases = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cases ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

/**
 * Retrieve a specific case by its ID.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM cases WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching case:', err);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
};

/**
 * Create a new case in the database.
 * @param {import('express').Request} req - Express request object containing title, description, status
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const createCase = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Title, description, and status are required' });
    }
    
    const query = `
      INSERT INTO cases (title, description, status) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await db.query(query, [title, description || null, req.user ? req.user.id : null]);
    const newCase = rows[0];
    
    if (req.user) {
      await logAction(req.user.id, 'CASE_CREATED', 'CASE', newCase.id, `Created case: ${title}`, req.ip);
    }
    
    res.status(201).json(newCase);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: 'Failed to create case' });
  }
};

/**
 * Update an existing case by its ID.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    const query = `
      UPDATE cases 
      SET title = $1, description = $2, status = $3 
      WHERE id = $4 
      RETURNING *
    `;
    const { rows } = await db.query(query, [title, description, status, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Case not found' });
    
    if (req.user) {
      await logAction(req.user.id, 'CASE_UPDATED', 'CASE', id, `Updated case: ${title}`, req.ip);
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating case:', err);
    res.status(500).json({ error: 'Failed to update case' });
  }
};

/**
 * Delete a case by its ID.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM cases WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Case not found' });
    
    if (req.user) {
      await logAction(req.user.id, 'CASE_DELETED', 'CASE', id, `Deleted case: ${rows[0].title}`, req.ip);
    }
    
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete case' });
  }
};

/**
 * Toggles public access and provisions a share_token if none exists.
 */
const togglePublicAccess = async (req, res) => {
  try {
    const { id } = req.params;
    // Get current state
    const { rows: currentRows } = await db.query('SELECT is_public, share_token FROM cases WHERE id = $1', [id]);
    if (currentRows.length === 0) return res.status(404).json({ error: 'Case not found' });
    
    let { is_public, share_token } = currentRows[0];
    is_public = !is_public; // Toggle

    if (is_public && !share_token) {
      share_token = uuidv4();
    }

    const query = `
      UPDATE cases 
      SET is_public = $1, share_token = $2, share_created_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `;
    const { rows } = await db.query(query, [is_public, share_token, id]);
    
    if (req.user) {
      const action = is_public ? 'PUBLIC_LINK_CREATED' : 'PUBLIC_LINK_DISABLED';
      await logAction(req.user.id, action, 'CASE', id, `Public visibility set to ${is_public}`, req.ip);
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error toggling public access:', err);
    res.status(500).json({ error: 'Failed to toggle public access' });
  }
};

/**
 * Generates a PDF report for the case.
 */
const generateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { graphImage } = req.body;
    
    const pdfBuffer = await generateInvestigationReport(id, graphImage);
    
    if (req.user) {
      await logAction(req.user.id, 'REPORT_GENERATED', 'CASE', id, 'Investigation Report generated', req.ip);
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Investigation_Report_Case_${id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  togglePublicAccess,
  generateReport
};
