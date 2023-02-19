const express = require('express');
const process = require('process');
require('dotenv').config();

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const routes = require('./routes/index');
const { SERVER_ERROR } = require('./utils/constants');

const app = express();

app.use(requestLogger);

app.use(cookieParser());
app.use(express.json());
app.use(cors);
mongoose.connect(MONGO_URL, { useNewUrlParser: true });

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадет');
  }, 0);
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка.' : message });
  next();
});

app.listen(PORT);
