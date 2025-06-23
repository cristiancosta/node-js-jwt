const {
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Configuration.
const configuration = require('../configuration');

// Constants.
const { errorMessage } = require('../constants');

// Errors.
const UnauthorizedError = require('../errors/unauthorized');
const InternalServerError = require('../errors/internal-server');
const ConflictError = require('../errors/conflict');

const authBearer = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    throw new UnauthorizedError(errorMessage.MISSING_AUTHORIZATION_HEADER);
  } else if (authorization === '') {
    throw new UnauthorizedError(
      errorMessage.MISSING_AUTHORIZATION_HEADER_VALUE
    );
  } else {
    const [prefix, token] = authorization.split(' ');
    if (prefix.toLowerCase() === 'bearer') {
      try {
        verify(token, configuration.jwt.secret);
        next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedError(errorMessage.TOKEN_EXPIRED);
        } else if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedError(errorMessage.INVALID_TOKEN);
        } else {
          console.error('authBearer#error', error);
          throw new InternalServerError(errorMessage.INTERNAL_SERVER_ERROR);
        }
      }
    } else {
      throw new ConflictError(errorMessage.INVALID_AUTHORIZATION_PREFIX);
    }
  }
};

module.exports = authBearer;
