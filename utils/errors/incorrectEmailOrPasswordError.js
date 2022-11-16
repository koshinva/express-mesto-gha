const { ERROR_CODE_401 } = require('./statusCode');

class IncorrectEmailOrPasswordError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_401;
  }
}
module.exports = IncorrectEmailOrPasswordError;
