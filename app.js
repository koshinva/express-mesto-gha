const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6364c7dd83493d60aa9f77e7',
  };

  next();
});
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.listen(PORT, () => {
  console.log('Server started...');
});
