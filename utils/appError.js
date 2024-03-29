class AppError extends Error {
  constructor(message, statusCode, isPublic = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.isPublic = isPublic;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
