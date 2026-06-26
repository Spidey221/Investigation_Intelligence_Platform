require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iip_db',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
});

const migration = `
ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token UUID UNIQUE,
ADD COLUMN IF NOT EXISTS share_created_at TIMESTAMP WITH TIME ZONE;
`;

const runMigration = async () => {
  try {
    console.log('Running Phase 6 migration (Sharing columns)...');
    await pool.query(migration);
    console.log('Migration successful. Sharing columns added to cases.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
};

runMigration();
