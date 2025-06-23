// Constants.
const { httpStatusCode } = require('../constants');

// Errors.
const BaseError = require('./base');

class ConflictError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.CONFLICT, true, errors);
  }
}

module.exports = ConflictError;
