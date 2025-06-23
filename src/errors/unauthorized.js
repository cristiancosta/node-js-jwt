// Constants.
const { httpStatusCode } = require('../constants');

// Errors.
const BaseError = require('./base');

class UnauthorizedError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.UNAUTHORIZED, true, errors);
  }
}

module.exports = UnauthorizedError;
