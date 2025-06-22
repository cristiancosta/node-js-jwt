require('dotenv').config();

const configuration = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nodejwt'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mysecret',
    accessTokenDuration: process.env.JWT_ACCESS_TOKEN_DURATION || '1d',
    refreshTokenDuration: process.env.JWT_REFRESH_TOKEN_DURATION || '3d'
  },
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 8080
  }
};

module.exports = configuration;
