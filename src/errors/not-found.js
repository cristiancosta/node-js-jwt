// Constants.
const { httpStatusCode } = require('../constants');

// Errors.
const BaseError = require('./base');

class NotFoundError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.NOT_FOUND, true, errors);
  }
}

module.exports = NotFoundError;
