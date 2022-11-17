const { ERROR_CODE_403 } = require('./statusCode');

class AccessRestrictionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_403;
  }
}
module.exports = AccessRestrictionError;
