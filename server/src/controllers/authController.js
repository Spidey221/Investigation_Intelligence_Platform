const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logAction } = require('../services/auditService');
const logger = require('../config/logger');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email }, 
    process.env.JWT_SECRET || 'supersecret_iip', 
    { expiresIn: '1d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const { rows: existing } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const { rows } = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hash]
    );

    const user = rows[0];
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      logger.warn(`LOGIN_FAILED: Unknown email ${email} from ${req.ip}`);
      await logAction(null, 'LOGIN_FAILED', 'AUTH', null, `Failed login attempt for email: ${email}`, req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logger.warn(`LOGIN_FAILED: Incorrect password for ${email} from ${req.ip}`);
      await logAction(null, 'LOGIN_FAILED', 'AUTH', null, `Failed login attempt for email: ${email}`, req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    await logAction(user.id, 'USER_LOGIN', 'USER', user.id, 'User logged in', req.ip);

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

const logout = async (req, res) => {
  if (req.user) {
    await logAction(req.user.id, 'USER_LOGOUT', 'USER', req.user.id, 'User logged out', req.ip);
  }
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

const getProfile = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
    
    // Get activity count
    const { rows: activity } = await db.query('SELECT COUNT(*) FROM audit_logs WHERE user_id = $1', [req.user.id]);
    
    const profile = {
      ...rows[0],
      activityCount: parseInt(activity[0].count)
    };
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};
