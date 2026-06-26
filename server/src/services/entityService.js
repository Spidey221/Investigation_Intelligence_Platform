const db = require('../db');
const { extractAllEntities } = require('./entityExtractor');

/**
 * Normalizes an entity value based on its type.
 */
const normalizeEntity = (type, value) => {
  if (!value) return '';
  let normalized = value.trim().replace(/\s+/g, ' ');

  if (type === 'EMAIL' || type === 'DOMAIN' || type === 'URL') {
    normalized = normalized.toLowerCase();
  }

  if (type === 'PHONE') {
    normalized = normalized.replace(/\s+/g, ''); // remove spaces
    // Check if it lacks international code +91
    if (normalized.length === 10) {
      normalized = '+91' + normalized;
    } else if (normalized.startsWith('91') && normalized.length === 12) {
      normalized = '+' + normalized;
    }
  }

  return normalized;
};

/**
 * Executes entity extraction on provided text and saves to the database.
 * @param {number} caseId
 * @param {number} evidenceId
 * @param {string} textContent 
 */
const processAndSaveEntities = async (caseId, evidenceId, textContent) => {
  if (!textContent) return [];

  const extracted = extractAllEntities(textContent);
  const savedEntities = [];

  for (const entity of extracted) {
    const normalizedValue = normalizeEntity(entity.type, entity.value);
    
    if (!normalizedValue) continue;

    try {
      const query = `
        INSERT INTO entities (case_id, evidence_id, entity_type, entity_value, source_text_excerpt, confidence_score)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (evidence_id, entity_type, entity_value) DO NOTHING
        RETURNING *
      `;
      const values = [
        caseId,
        evidenceId,
        entity.type,
        normalizedValue,
        entity.excerpt,
        1.0 // Default confidence score
      ];

      const { rows } = await db.query(query, values);
      if (rows.length > 0) {
        savedEntities.push(rows[0]);
      }
    } catch (err) {
      console.error(`Failed to save entity ${normalizedValue}:`, err);
    }
  }

  return savedEntities;
};

module.exports = {
  processAndSaveEntities,
  normalizeEntity
};
