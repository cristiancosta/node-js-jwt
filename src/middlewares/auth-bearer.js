// Constants.
const { errorMessage, tokenSubject } = require('../constants');

// Errors.
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');

// Utils.
const { verifyJwt } = require('../utils');

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
      verifyJwt(token, tokenSubject.ACCESS_TOKEN);
      next();
    } else {
      throw new ConflictError(errorMessage.INVALID_AUTHORIZATION_PREFIX);
    }
  }
};

module.exports = authBearer;
