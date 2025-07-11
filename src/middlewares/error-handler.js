// Constants.
const { errorMessage } = require('../constants/error-message');
const { httpStatusCode } = require('../constants/http-status-code');

// Errors.
const { BaseError } = require('../errors/base');

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof BaseError) {
    res
      .status(error.httpCode)
      .send({ message: error.message, errors: error.errors });
  } else {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessage.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { errorHandler };
