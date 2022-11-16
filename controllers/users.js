require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.checkEmail(email);
  bcrypt.hash(password, 12).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
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
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    })
    .catch(next);
};
