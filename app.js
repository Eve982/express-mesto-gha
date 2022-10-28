const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const isURL = require('validator/lib/isEmail');

const { object, string } = Joi.types();
const process = require('process');
const { SERVER_ERROR } = require('./utils/constants');
const NotFoundError = require('./errors/not_found_error');
const { login, createUser } = require('./controllers/users');

const app = express();
app.use(cookieParser());
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});
app.use(express.json());

app.post('/signin', celebrate({
  body: object.keys({
    email: string.required().email(),
    password: string.required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: object.keys({
    name: string.min(2).max(30),
    about: string.min(2).max(30),
    avatar: string.min(2).pattern({
      validator: (v) => isURL(v), message: 'Некорректный URL-адрес.',
    }),
    email: string.required().email(),
    password: string.required(),
  }),
}), createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use('*', (req, res) => {
  const err = new NotFoundError(`Запрашиваемый ресурс ${req.baseUrl} не найден.`);
  res.status(err.statusCode).send({ message: err.message });
});

app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка.' : message });
  next();
});

process.on('uncaughtException', (err, origin) => {
  console.err(`${origin} ${err.name} c текстом ${err.message} не была обработана.
Обратите внимание!`);
});

app.listen(PORT);
