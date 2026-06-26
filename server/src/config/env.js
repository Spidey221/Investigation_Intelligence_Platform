require('dotenv').config();

const requiredEnvs = [
  'DB_USER',
  'DB_HOST',
  'DB_NAME',
  'DB_PASSWORD',
  'DB_PORT',
  'JWT_SECRET',
];

const validateEnv = () => {
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnvs.join(', ')}`);
    process.exit(1);
  }
};

validateEnv();

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  }
};
