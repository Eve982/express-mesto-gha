const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '634d9ec31ec53a8b49096385',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// app.use((req, res, next) => {
//   res.status(400).send({ message: 'Некорректный запрос.' });
//   return next();
// });

// app.use((req, res, next) => {
//   res.status(404).send({ message: 'Некорректный путь запроса' });
//   return next();
// });

app.use((err, req, res, next) => {
  res.status(500).send('На сервере произошла ошибка.');
  return next();
});

app.listen(PORT);

// 400 "Bad Request" — переданы некорректные данные в методы создания карточки,
//  пользователя, обновления аватара пользователя или профиля;
// 404 "NotFound" — карточка или пользователь не найден или был запрошен несуществующий роут;
// 500 "Internal Server Error"— На сервере произошла ошибка
