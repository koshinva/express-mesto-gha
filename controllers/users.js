const User = require('../models/user');
const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/errors/statusCode');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_CODE_500).json({ message: err.message }));
};
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE_404).json({ message: 'Пользователь не найден' });
    });
};
module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE_400).json({
        message: 'Переданы некорректные данные в метод создания пользователя',
      });
    });
};
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE_400).json({
        message:
          'Переданы некорректные данные в метод обновления профиля пользователя',
      });
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE_400).json({
        message:
          'Переданы некорректные данные в метод обновления аватара пользователя',
      });
    });
};
