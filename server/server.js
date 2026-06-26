const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const casesRoutes = require('./src/routes/cases');
const evidenceRoutes = require('./src/routes/evidence');
const entitiesRoutes = require('./src/routes/entities');
const relationshipsRoutes = require('./src/routes/relationships');
const sharedRoutes = require('./src/routes/shared');

app.use('/api/cases', casesRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api', entitiesRoutes);
app.use('/api', relationshipsRoutes);
app.use('/api/shared/cases', sharedRoutes);

// Static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
