const db = require('../db');

// Get all cases
const getCases = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cases ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

// Get a single case by id
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

// Create a new case
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

// Update an existing case
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

// Delete a case
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
