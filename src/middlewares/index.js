// Middlewares.
const authBearer = require('./auth-bearer');
const errorHandler = require('./error-handler');
const swaggerBasicAuth = require('./swagger-basic-auth');

module.exports = {
  authBearer,
  errorHandler,
  swaggerBasicAuth
};
