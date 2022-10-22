const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const { SERVER_ERROR, CAST_ERROR, NOT_FOUND } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((usersData) => res.send(usersData))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error())
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error())
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error())
    .then((avatarData) => res.send(avatarData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
