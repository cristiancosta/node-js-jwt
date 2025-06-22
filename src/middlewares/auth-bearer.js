const {
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Configuration.
const configuration = require('../configuration');

// Constants.
const { errorMessage, httpStatusCode } = require('../constants');

const authBearer = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    res
      .status(httpStatusCode.UNAUTHORIZED)
      .send({ error: errorMessage.MISSING_AUTHORIZATION_HEADER });
  } else if (authorization === '') {
    res
      .status(httpStatusCode.UNAUTHORIZED)
      .send({ error: errorMessage.MISSING_AUTHORIZATION_HEADER_VALUE });
  } else {
    const [prefix, token] = authorization.split(' ');
    if (prefix.toLowerCase() === 'bearer') {
      try {
        verify(token, configuration.jwt.secret);
        next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res
            .status(httpStatusCode.UNAUTHORIZED)
            .send({ error: errorMessage.TOKEN_EXPIRED });
        } else if (error instanceof JsonWebTokenError) {
          res
            .status(httpStatusCode.UNAUTHORIZED)
            .send({ error: errorMessage.INVALID_TOKEN });
        } else {
          console.error('authBearer#error', error);
          res
            .status(httpStatusCode.INTERNAL_SERVER_ERROR)
            .send({ error: errorMessage.INTERNAL_SERVER_ERROR });
        }
      }
    } else {
      res
        .status(httpStatusCode.CONFLICT)
        .send({ error: errorMessage.INVALID_PREFIX });
    }
  }
};

module.exports = authBearer;
