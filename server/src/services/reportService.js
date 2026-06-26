const PDFDocument = require('pdfkit');
const db = require('../db');

const generateInvestigationReport = async (caseId, graphImageData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Fetch Case Data
      const caseQuery = 'SELECT * FROM cases WHERE id = $1';
      const { rows: caseRows } = await db.query(caseQuery, [caseId]);
      if (caseRows.length === 0) throw new Error('Case not found');
      const caseData = caseRows[0];

      // 2. Fetch Statistics
      const evQuery = 'SELECT COUNT(*) as count FROM evidence WHERE case_id = $1';
      const { rows: evRows } = await db.query(evQuery, [caseId]);
      const totalEvidence = parseInt(evRows[0].count);

      const entQuery = 'SELECT entity_type, COUNT(*) as count FROM entities WHERE case_id = $1 GROUP BY entity_type ORDER BY count DESC';
      const { rows: entRows } = await db.query(entQuery, [caseId]);
      const totalEntities = entRows.reduce((sum, row) => sum + parseInt(row.count), 0);
      const mostCommonEntity = entRows.length > 0 ? entRows[0].entity_type : 'N/A';

      const relQuery = 'SELECT COUNT(*) as count FROM relationships WHERE case_id = $1';
      const { rows: relRows } = await db.query(relQuery, [caseId]);
      const totalRelationships = parseInt(relRows[0].count);

      // 3. Document Generation
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Cover Page
      doc.fontSize(24).font('Helvetica-Bold').text('Investigation Intelligence Report', { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(16).font('Helvetica-Bold').text(`Case Name: ${caseData.title}`);
      doc.fontSize(12).font('Helvetica').text(`Status: ${caseData.status}`);
      doc.text(`Created On: ${new Date(caseData.created_at).toLocaleString()}`);
      doc.text(`Report Generated On: ${new Date().toLocaleString()}`);
      doc.moveDown(2);

      doc.fontSize(14).font('Helvetica-Bold').text('Case Description');
      doc.fontSize(12).font('Helvetica').text(caseData.description || 'No description provided.', { align: 'justify' });
      doc.moveDown(2);

      // Statistics Section
      doc.fontSize(14).font('Helvetica-Bold').text('Investigation Statistics');
      doc.fontSize(12).font('Helvetica')
         .text(`Total Evidence: ${totalEvidence}`)
         .text(`Total Entities Extracted: ${totalEntities}`)
         .text(`Most Common Entity Type: ${mostCommonEntity}`)
         .text(`Total Relationships Discovered: ${totalRelationships}`);
      doc.moveDown(2);

      // Evidence Summary
      doc.addPage();
      doc.fontSize(18).font('Helvetica-Bold').text('Evidence Summary');
      doc.moveDown();
      const { rows: evidenceRows } = await db.query('SELECT title, type, created_at FROM evidence WHERE case_id = $1 ORDER BY created_at ASC', [caseId]);
      
      evidenceRows.forEach((ev, index) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. ${ev.title} [${ev.type}]`);
        doc.fontSize(10).font('Helvetica').text(`Secured on: ${new Date(ev.created_at).toLocaleString()}`);
        doc.moveDown();
      });

      // Intelligence Graph
      if (graphImageData) {
        try {
          doc.addPage();
          doc.fontSize(18).font('Helvetica-Bold').text('Intelligence Graph Visualization');
          doc.moveDown();
          
          const base64Data = graphImageData.replace(/^data:image\/\w+;base64,/, '');
          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          // Fit image to A4 width
          doc.image(imageBuffer, {
            fit: [500, 600],
            align: 'center',
            valign: 'center'
          });
        } catch (imgErr) {
          console.error('Failed to embed graph image:', imgErr);
        }
      }

      doc.end();
    } catch (err) {
      console.error('Report Generation Error:', err);
      reject(err);
    }
  });
};

module.exports = {
  generateInvestigationReport
};
