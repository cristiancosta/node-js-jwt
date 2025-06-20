require('dotenv').config();

const configuration = {
  db: {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'postgres'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mysecret',
  },
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 8080,
  },
};

module.exports = configuration;
