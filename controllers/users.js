const User = require('../models/user');
const IncorrectDataError = require('../utils/errors/incorrectDataError');
const NotFoundError = require('../utils/errors/notFoundError');
const {
  STATUS_CODE_200,
  STATUS_CODE_201,
} = require('../utils/errors/statusCode');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(STATUS_CODE_200).send({ data: user });
      } else {
        throw new NotFoundError(`Пользователь с указанным ${userId} не найден`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Введён некорректный ID'));
        return;
      }
      next(err);
    });
};
module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
        return;
      }
      next(err);
    });
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(STATUS_CODE_200).send({ data: user });
      }
      throw new NotFoundError(
        `Пользователь с указанным ${req.user._id} не найден`,
      );
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
        return;
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Введён некорректный ID'));
        return;
      }
      next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(STATUS_CODE_200).send({ data: user });
      }
      throw new NotFoundError(
        `Пользователь с указанным ${req.user._id} не найден`,
      );
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
        return;
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Введён некорректный ID'));
        return;
      }
      next(err);
    });
};
