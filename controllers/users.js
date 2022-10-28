const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found_error');
const EmailExistError = require('../errors/email_exist_error');
const BadRequestError = require('../errors/bad_request_error');
const { CREATED, JWT_SECRET } = require('../utils/constants');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((usersData) => res.send(usersData))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.status(CREATED)
      .send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new NotFoundError(`Переданы некорректные данные при создании пользователя. ${err}`));
      } if (err.code === 11000) {
        next(new EmailExistError(`Пользователь с email ${email} уже зарегистрирован.`));
      } next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователя с таким ID не существует.'));
      } next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail()
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля. ${err}`));
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователя с таким ID не существует.'));
      } next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail()
    .then((avatarData) => res.send(avatarData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении аватара. ${err}`));
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователя с таким ID не существует.'));
      } next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie(
        'jwt',
        token,
        { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true },
      ).send({ message: 'Вход выполнен успешно!' });
    })
    .catch(next);
};
