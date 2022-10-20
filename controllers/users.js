const User = require('../models/user');
const errorHandler = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((usersData) => res.send({ usersData }))
    .catch((err) => res.send(errorHandler(err.status)));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => res.send({ userData }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { _id } = req.body;
  User.findById({ _id })
    .populate('card')
    .then((userData) => res.send({ userData }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { _id, name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about })
    .then((userData) => res.send({ userData }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { _id, avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar })
    .then((avatarData) => res.send({ avatarData }))
    .catch((err) => res.status(400).send({ message: err.message }));
};
