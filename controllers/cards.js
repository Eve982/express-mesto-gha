const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const { CAST_ERROR, NOT_FOUND, SERVER_ERROR } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cardsData) => res.send(cardsData))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.', err });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.', err });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((cardsData) => res.send(cardsData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточки с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточки с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(CAST_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточки с таким ID не существует.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
