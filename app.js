const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND } = require('./utils/utils');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '634d9ec31ec53a8b49096385',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Некорректный путь запроса' });
});

app.listen(PORT);
