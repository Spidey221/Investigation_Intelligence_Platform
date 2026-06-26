const db = require('../db');

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
    const { rows } = await db.query(query, [title, description, status]);
    res.status(201).json(rows[0]);
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
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
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
    const { rowCount } = await db.query('DELETE FROM cases WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error('Error deleting case:', err);
    res.status(500).json({ error: 'Failed to delete case' });
  }
};

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase
};
