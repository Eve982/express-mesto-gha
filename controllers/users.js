const { default: mongoose } = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((usersData) => res.send(usersData))
    .catch(() => res.status(500).send('На сервере произошла ошибка.'));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send('На сервере произошла ошибка.');
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      } if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(500).send('На сервере произошла ошибка.');
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, name, about)
    .orFail(new Error('NotFound'))
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(500).send('На сервере произошла ошибка.');
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, avatar)
    .orFail(new Error('NotFound'))
    .then((avatarData) => res.send(avatarData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(500).send('На сервере произошла ошибка.');
    });
};
