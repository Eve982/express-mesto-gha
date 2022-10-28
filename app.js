const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const process = require('process');

const auth = require('./middlewares/auth');
const { SERVER_ERROR } = require('./utils/constants');
const NotFoundError = require('./errors/not_found_error');
const { login, createUser } = require('./controllers/users');
// const BadRequestError = require('./errors/bad_request_error');

const app = express();
app.use(cookieParser());
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});
app.use(express.json());

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(errors());
app.use('*', (req, res) => {
  const err = new NotFoundError(`Запрашиваемый ресурс ${req.baseUrl} не найден.`);
  res.status(err.statusCode).send({ message: err.message });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка.' : message });
  next();
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана.
Обратите внимание!`);
});

app.listen(PORT);
