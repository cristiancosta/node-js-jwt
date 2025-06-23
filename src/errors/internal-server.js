// Constants.
const { httpStatusCode } = require('../constants');

// Errors.
const BaseError = require('./base');

class InternalServerError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.INTERNAL_SERVER_ERROR, true, errors);
  }
}

module.exports = InternalServerError;
