const Card = require('../models/card');
const IncorrectDataError = require('../utils/errors/incorrectDataError');
const NotFoundError = require('../utils/errors/notFoundError');
const {
  STATUS_CODE_200,
  STATUS_CODE_201,
} = require('../utils/errors/statusCode');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_200).send({ data: cards }))
    .catch(next);
};
module.exports.addCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODE_201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные в методы создания карточки',
          ),
        );
        return;
      }
      next(err);
    });
};
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным ${cardId} не найден`);
      }
      return card.remove().then(() => {
        res
          .status(STATUS_CODE_200)
          .send({ message: 'Карточка успешно удалена' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные для удаления карточки',
          ),
        );
        return;
      }
      next(err);
    });
};
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий ${cardId} карточки`);
      }
      res.status(STATUS_CODE_201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
        return;
      }
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(STATUS_CODE_200).send({ data: card });
        return;
      }
      throw new NotFoundError(`Передан несуществующий ${cardId} карточки`);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new IncorrectDataError(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
        return;
      }
      next(err);
    });
};
