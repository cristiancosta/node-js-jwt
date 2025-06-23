// Constants.
const { httpStatusCode } = require('../constants');

// Errors.
const BaseError = require('./base');

class BadRequestError extends BaseError {
  constructor(message, errors) {
    super(message, httpStatusCode.BAD_REQUEST, true, errors);
  }
}

module.exports = BadRequestError;
