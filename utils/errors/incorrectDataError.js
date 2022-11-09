const { ERROR_CODE_400 } = require('./statusCode');

class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_400;
  }
}
module.exports = IncorrectDataError;
