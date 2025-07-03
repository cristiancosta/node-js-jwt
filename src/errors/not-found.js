// Constants.
const { httpStatusCode } = require('../constants/http-status-code');

// Errors.
const { BaseError } = require('./base');

class NotFoundError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.NOT_FOUND, true, errors);
  }
}

module.exports = { NotFoundError };
