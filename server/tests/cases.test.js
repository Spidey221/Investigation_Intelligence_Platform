const request = require('supertest');
const express = require('express');
const casesRoutes = require('../src/routes/cases');
const db = require('../src/db');

jest.mock('../src/db');
jest.mock('../src/services/auditService', () => ({
  logAction: jest.fn()
}));

// Mock authentication middleware
jest.mock('../src/middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 1, role: 'INVESTIGATOR', email: 'inv@iip.local' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/cases', casesRoutes);

describe('Cases API - RBAC', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow INVESTIGATOR to create a case', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'New Case', description: 'Test' }]
    });

    const res = await request(app)
      .post('/api/cases')
      .send({ title: 'New Case', description: 'Test' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should allow INVESTIGATOR to access cases list', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Case 1' }]
    });

    const res = await request(app).get('/api/cases');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
