const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const errorHandler = require('./utils/errorHandler');
const NotFoundError = require('./utils/errors/notFoundError');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^https*:\/{2}(www\.)?[\w\W]{2,}#?$/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  addUser,
);
app.use('/users', auth, routeUsers);
app.use('/cards', auth, routeCards);
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Неправильно указан путь'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
