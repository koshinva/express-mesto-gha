const { ERROR_CODE_404 } = require('./statusCode');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_404;
  }
}
module.exports = NotFoundError;
