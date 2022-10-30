const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not_found_error');
const BadRequestError = require('../errors/bad_request_error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cardsData) => res.send(cardsData))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new NotFoundError('Переданы некорректные данные при создании карточки.'));
      } next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.isCardOwner(req.params.cardId, req.user._id)
    .then((cardId) => Card.findByIdAndRemove(cardId).orFail())
    .then((cardsData) => res.send(cardsData))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Переданы некорректные данные при удалении карточки.'));
      } next(err);
    });
};

module.exports.setCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточки с таким ID не существует.'));
      } next(err);
    });
};

module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточки с таким ID не существует.'));
      } next(err);
    });
};
