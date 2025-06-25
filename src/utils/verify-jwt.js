const {
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Constants.
const { errorMessage, jwtAlgorithm } = require('../constants');

// Configuration.
const configuration = require('../configuration');

// Errors.
const UnauthorizedError = require('../errors/unauthorized');

const verifyJwt = (token, expectedSubject) => {
  try {
    const { secret } = configuration.jwt;
    const jwt = verify(token, secret, {
      algorithms: [jwtAlgorithm.HS512],
      complete: true
    });
    if (jwt.payload.sub !== expectedSubject) {
      throw new UnauthorizedError(errorMessage.INVALID_TOKEN_SUBJECT);
    }
    return jwt.payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError(errorMessage.TOKEN_EXPIRED);
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError(errorMessage.INVALID_TOKEN);
    }
  }
};

module.exports = verifyJwt;
