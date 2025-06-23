class BaseError extends Error {
  message;
  httpCode;
  isOperational;
  errors;

  constructor(message, httpCode, isOperational, errors) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.errors = errors;
  }
}

module.exports = BaseError;
