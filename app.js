const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT);

app.use((req, res, next) => {
  req.user = {
    _id: '634d9ec31ec53a8b49096385',
  };
  next();
});
