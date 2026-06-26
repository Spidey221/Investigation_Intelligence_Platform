const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Routes
const casesRoutes = require('./src/routes/cases');
const evidenceRoutes = require('./src/routes/evidence');
const entitiesRoutes = require('./src/routes/entities');
const relationshipsRoutes = require('./src/routes/relationships');
const sharedRoutes = require('./src/routes/shared');
const authRoutes = require('./src/routes/auth');
const auditRoutes = require('./src/routes/audit');

const authenticate = require('./src/middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/shared/cases', sharedRoutes);

app.use('/api/audit', authenticate, auditRoutes);
app.use('/api/cases', casesRoutes); // Inner routes are protected
app.use('/api/evidence', evidenceRoutes); // Inner routes are protected
app.use('/api', authenticate, entitiesRoutes);
app.use('/api', authenticate, relationshipsRoutes);

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
