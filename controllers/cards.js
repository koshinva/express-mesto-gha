const Card = require('../models/card');
const { ERROR_CODE_400 } = require('../utils/errors/statusCode');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_CODE_400).json({
        message: 'Переданы некорректные данные в методы создания карточки',
      });
    });
};
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
