const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const IncorrectDataError = require('../utils/errors/incorrectDataError');
const IncorrectEmailOrPasswordError = require('../utils/errors/incorrectEmailOrPasswordError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
});

userSchema.statics.checkEmail = function checkEmail(email) {
  if (!validator.isEmail(email)) {
    throw new IncorrectDataError('Некорректный email');
  }
};
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      throw new IncorrectEmailOrPasswordError('Неправильные почта или пароль');
    }
    bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new IncorrectEmailOrPasswordError(
          'Неправильные почта или пароль',
        );
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
