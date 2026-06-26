const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');
const db = require('../src/db');

jest.mock('../src/db');
jest.mock('../src/services/auditService', () => ({
  logAction: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login a user with correct credentials', async () => {
    // Mock db.query for user lookup
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        email: 'admin@iip.local',
        password_hash: '$2b$10$w3aZ/...mockedHash...', // We would mock bcrypt, but let's mock bcrypt inside authController or just test structure.
        role: 'ADMIN'
      }]
    });

    // We can't easily mock bcrypt inside the imported controller without more setup,
    // so we mock bcrypt directly.
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@iip.local', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('role', 'ADMIN');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should fail login with wrong credentials', async () => {
    db.query.mockResolvedValueOnce({
      rows: []
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@iip.local', password: 'wrong' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});
