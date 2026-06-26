require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iip_db',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
});

const migration = async () => {
  try {
    console.log('Running Phase 7 migration...');
    
    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'INVESTIGATOR',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Audit Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(255) NOT NULL,
          resource_type VARCHAR(100),
          resource_id INTEGER,
          details TEXT,
          ip_address VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Add foreign keys and hash column
    await pool.query(`
      ALTER TABLE cases ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);
    
    await pool.query(`
      ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_hash TEXT;
    `);

    await pool.query(`
      ALTER TABLE evidence ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);

    // 4. Create Default Admin User
    const adminEmail = 'admin@iip.local';
    const { rows: existingAdmin } = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    let adminId;
    if (existingAdmin.length === 0) {
      console.log('Creating default System Administrator...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt); // Default password
      const { rows: newAdmin } = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        ['System Administrator', adminEmail, hash, 'ADMIN']
      );
      adminId = newAdmin[0].id;
    } else {
      adminId = existingAdmin[0].id;
    }

    // 5. Assign existing records to Admin
    console.log(`Assigning existing records to Admin (ID: ${adminId})...`);
    await pool.query('UPDATE cases SET created_by = $1 WHERE created_by IS NULL', [adminId]);
    await pool.query('UPDATE evidence SET uploaded_by = $1 WHERE uploaded_by IS NULL', [adminId]);

    console.log('Phase 7 Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
};

migration();
