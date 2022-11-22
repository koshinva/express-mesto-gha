const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const schemaCheckCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .required()
        .pattern(/^https*:\/{2}(www\.)?[\w\W]{2,}\.{1}[\w\W]+#?$/),
    }),
  }),
  addCard,
);
router.delete('/:cardId', celebrate(schemaCheckCardId), deleteCard);
router.put('/:cardId/likes', celebrate(schemaCheckCardId), likeCard);
router.delete('/:cardId/likes', celebrate(schemaCheckCardId), dislikeCard);

module.exports = router;
