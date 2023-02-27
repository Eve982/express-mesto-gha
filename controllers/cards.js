const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not_found_error');
const BadRequestError = require('../errors/bad_request_error');
const { CREATED } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({}).select({}).populate('owner').sort({ _id: -1 })
    .then((cardsData) => {
      res.send(cardsData);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new NotFoundError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.isCardOwner(req.params.cardId, req.user._id)
    .then((card) => card.remove())
    .then((cardsData) => res.send(cardsData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new NotFoundError('Переданы некорректные данные при удалении карточки.'));
      }
      return next(err);
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
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточки с таким ID не существует.'));
      } return next(err);
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
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточки с таким ID не существует.'));
      } return next(err);
    });
};
