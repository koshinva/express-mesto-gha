const jwt = require('jsonwebtoken');
const UnsanctionedError = require('../utils/errors/unsanctionedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnsanctionedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, '96a5281308389ea0b68de98da03e3c35');
  } catch (error) {
    return next(new UnsanctionedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
