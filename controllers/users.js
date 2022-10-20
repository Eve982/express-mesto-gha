const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const { errorMessage400 } = require('../utils/utils');

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
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.body;
  User.findById({ _id })
    .populate('card')
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { _id, name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about })
    .then((userData) => res.send({ userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { _id, avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar })
    .then((avatarData) => res.send({ avatarData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};
