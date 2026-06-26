require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const migrate = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS evidence (
          id SERIAL PRIMARY KEY,
          case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          content TEXT,
          file_path VARCHAR(255),
          original_filename VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('Migration successful: evidence table created');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
};

migrate();
