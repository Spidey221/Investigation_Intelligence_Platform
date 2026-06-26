const db = require('../db');

/**
 * Creates 'ASSOCIATED_WITH' and 'BELONGS_TO' relationships for entities within a single piece of evidence.
 */
const createEvidenceRelationships = async (caseId, evidenceId) => {
  try {
    const { rows: entities } = await db.query(
      'SELECT id, entity_type, entity_value FROM entities WHERE evidence_id = $1',
      [evidenceId]
    );

    if (entities.length < 2) return;

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const source = entities[i];
        const target = entities[j];

        let type = 'ASSOCIATED_WITH';
        let confidence = 0.8;

        // Check for BELONGS_TO (URL -> DOMAIN)
        if (source.entity_type === 'URL' && target.entity_type === 'DOMAIN' && source.entity_value.includes(target.entity_value)) {
          type = 'BELONGS_TO';
          confidence = 1.0;
        } else if (target.entity_type === 'URL' && source.entity_type === 'DOMAIN' && target.entity_value.includes(source.entity_value)) {
          type = 'BELONGS_TO';
          confidence = 1.0;
        }

        const sId = type === 'BELONGS_TO' && target.entity_type === 'URL' ? target.id : source.id;
        const tId = type === 'BELONGS_TO' && target.entity_type === 'URL' ? source.id : target.id;

        await db.query(`
          INSERT INTO relationships (case_id, source_entity_id, target_entity_id, relationship_type, source_evidence_id, confidence_score)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [caseId, sId, tId, type, evidenceId, confidence]);
      }
    }
  } catch (err) {
    console.error('Error creating evidence relationships:', err);
  }
};

/**
 * Creates cross-evidence relationships like REPEATED_INDICATOR and CO_OCCURS.
 */
const generateRelationships = async (caseId) => {
  try {
    // REPEATED_INDICATOR: Connect identical entities across different evidence items
    await db.query(`
      INSERT INTO relationships (case_id, source_entity_id, target_entity_id, relationship_type, source_evidence_id, confidence_score)
      SELECT e1.case_id, e1.id, e2.id, 'REPEATED_INDICATOR', e2.evidence_id, 0.9
      FROM entities e1
      JOIN entities e2 ON e1.entity_value = e2.entity_value 
        AND e1.entity_type = e2.entity_type 
        AND e1.id < e2.id 
        AND e1.evidence_id != e2.evidence_id
      WHERE e1.case_id = $1
      ON CONFLICT DO NOTHING
    `, [caseId]);

    // CO_OCCURS: Two different entity values appear together in more than one evidence
    await db.query(`
      INSERT INTO relationships (case_id, source_entity_id, target_entity_id, relationship_type, source_evidence_id, confidence_score)
      SELECT r1.case_id, r1.source_entity_id, r1.target_entity_id, 'CO_OCCURS', r1.source_evidence_id, 0.95
      FROM relationships r1
      JOIN relationships r2 ON r1.source_entity_id = r2.source_entity_id 
        AND r1.target_entity_id = r2.target_entity_id 
        AND r1.source_evidence_id != r2.source_evidence_id
      WHERE r1.case_id = $1 AND r1.relationship_type = 'ASSOCIATED_WITH' AND r2.relationship_type = 'ASSOCIATED_WITH'
      ON CONFLICT DO NOTHING
    `, [caseId]);

  } catch (err) {
    console.error('Error generating relationships:', err);
  }
};

/**
 * Returns relationships for the dashboard.
 */
const getCaseRelationships = async (caseId) => {
  const query = `
    SELECT r.*, 
           s.entity_type as source_type, s.entity_value as source_value,
           t.entity_type as target_type, t.entity_value as target_value,
           ev.title as evidence_title
    FROM relationships r
    JOIN entities s ON r.source_entity_id = s.id
    JOIN entities t ON r.target_entity_id = t.id
    LEFT JOIN evidence ev ON r.source_evidence_id = ev.id
    WHERE r.case_id = $1
    ORDER BY r.created_at DESC
  `;
  const { rows } = await db.query(query, [caseId]);
  return rows;
};

const getMostConnectedEntity = (nodes, edges) => {
  const counts = {};
  edges.forEach(e => {
    counts[e.source] = (counts[e.source] || 0) + 1;
    counts[e.target] = (counts[e.target] || 0) + 1;
  });
  
  let maxId = null;
  let maxCount = 0;
  for (const [id, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxId = id;
    }
  }
  
  return nodes.find(n => n.id === maxId) || null;
};

const getRelationshipStatistics = (nodes, edges) => {
  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    mostConnectedEntity: getMostConnectedEntity(nodes, edges) || {}
  };
};

/**
 * Builds the graph layout. Groups entities with the same value into a single node.
 */
const buildGraph = async (caseId) => {
  const { rows: entities } = await db.query('SELECT * FROM entities WHERE case_id = $1', [caseId]);
  const rels = await getCaseRelationships(caseId);

  // Map entity values to node IDs to avoid drawing the same IP address 5 times.
  const uniqueNodesMap = new Map(); // entity_value -> node object
  
  entities.forEach(e => {
    if (!uniqueNodesMap.has(e.entity_value)) {
      uniqueNodesMap.set(e.entity_value, {
        id: `node-${e.entity_value}`,
        data: { 
          label: e.entity_value, 
          type: e.entity_type,
          evidenceCount: 1,
          dbIds: [e.id]
        },
        position: { x: 0, y: 0 } // Layout engine will set this
      });
    } else {
      const node = uniqueNodesMap.get(e.entity_value);
      node.data.evidenceCount += 1;
      node.data.dbIds.push(e.id);
    }
  });

  const nodes = Array.from(uniqueNodesMap.values());
  const edges = [];
  const edgeSet = new Set();

  rels.forEach(r => {
    const sId = `node-${r.source_value}`;
    const tId = `node-${r.target_value}`;
    
    // Ignore self-loops (e.g. REPEATED_INDICATOR on the exact same value)
    if (sId === tId) return;

    const edgeId = `${sId}-${tId}-${r.relationship_type}`;
    if (!edgeSet.has(edgeId)) {
      edgeSet.add(edgeId);
      edges.push({
        id: edgeId,
        source: sId,
        target: tId,
        label: r.relationship_type,
        type: 'default',
        animated: r.relationship_type === 'CO_OCCURS'
      });
    }
  });

  const statistics = getRelationshipStatistics(nodes, edges);

  return { nodes, edges, statistics };
};

module.exports = {
  createEvidenceRelationships,
  generateRelationships,
  getCaseRelationships,
  buildGraph
};
