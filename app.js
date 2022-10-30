const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const process = require('process');
const routes = require('./routes/index');
const NotFoundError = require('./errors/not_found_error');
const { SERVER_ERROR } = require('./utils/constants');

const app = express();
app.use(cookieParser());
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(routes);

app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс ${req.baseUrl} не найден.`));
});

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка.' : message });
  next();
});

app.listen(PORT);
