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
const InternalServerError = require('../errors/internal-server');

const verifyJwt = (token, expectedSubject) => {
  let jwt;
  try {
    const { secret } = configuration.jwt;
    jwt = verify(token, secret, {
      algorithms: [jwtAlgorithm.HS512],
      complete: true
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError(errorMessage.TOKEN_EXPIRED);
    } else if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError(errorMessage.INVALID_TOKEN);
    } else {
      console.error('verifyJwt#error', error);
      throw new InternalServerError(errorMessage.INTERNAL_SERVER_ERROR);
    }
  }
  if (jwt.payload.sub !== expectedSubject) {
    throw new UnauthorizedError(errorMessage.INVALID_TOKEN_SUBJECT);
  }
  return jwt.payload;
};

module.exports = verifyJwt;
