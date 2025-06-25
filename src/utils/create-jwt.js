const { sign } = require('jsonwebtoken');

// Configuration.
const configuration = require('../configuration');

// Constants.
const { tokenSubject, errorMessage, jwtAlgorithm } = require('../constants');

// Errors.
const ConflictError = require('../errors/conflict');

const createJwt = (subject, payload) => {
  const { secret } = configuration.jwt;
  switch (subject) {
    case tokenSubject.ACCESS_TOKEN: {
      const { accessTokenDuration } = configuration.jwt;
      const accessTokenOptions = {
        algorithm: jwtAlgorithm.HS512,
        subject: tokenSubject.ACCESS_TOKEN,
        expiresIn: accessTokenDuration
      };
      const accessToken = sign(payload, secret, accessTokenOptions);
      return accessToken;
    }
    case tokenSubject.REFRESH_TOKEN: {
      const { refreshTokenDuration } = configuration.jwt;
      const refreshTokenOptions = {
        algorithm: jwtAlgorithm.HS512,
        subject: tokenSubject.REFRESH_TOKEN,
        expiresIn: refreshTokenDuration
      };
      const refreshToken = sign(payload, secret, refreshTokenOptions);
      return refreshToken;
    }
    default:
      throw new ConflictError(errorMessage.INVALID_TOKEN_SUBJECT);
  }
};

module.exports = createJwt;
