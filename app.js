const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

app.post('/signin', login);
app.post('/signup', addUser);
app.use('/users', auth, routeUsers);
app.use('/cards', auth, routeCards);
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Неправильно указан путь'));
});

app.use(errorHandler);

app.listen(PORT);
