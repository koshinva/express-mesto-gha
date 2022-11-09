const { ERROR_CODE_500 } = require('./errors/statusCode');

const errorHandler = (err, req, res, next) => {
  const { statusCode = ERROR_CODE_500, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_CODE_500 ? 'Ошибка по умолчанию' : message,
  });
  next();
};
module.exports = errorHandler;
