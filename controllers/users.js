const { default: mongoose } = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((usersData) => res.send(usersData))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(404).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.body;
  User.findById({ _id })
    .orFail(new Error('NotFound'))
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { _id, name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about })
    .orFail(new Error('NotFound'))
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { _id, avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar })
    .orFail(new Error('NotFound'))
    .then((avatarData) => res.send({ avatarData }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователя с таким ID не существует.' });
      }
      return next(err);
    });
};
