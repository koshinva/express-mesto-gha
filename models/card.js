const mongoose = require('mongoose');
const IncorrectDataError = require('../utils/errors/incorrectDataError');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
});
cardSchema.statics.checkUrlLink = function checkUrlLink(link) {
  const regex = /^https*:\/{2}(www\.)?[\w\W]{2,}#?$/;
  if (!regex.test(link)) {
    throw new IncorrectDataError(
      `${link} некорректная ссылка для изображения карточки`,
    );
  }
};
module.exports = mongoose.model('card', cardSchema);
