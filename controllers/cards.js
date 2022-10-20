const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const { errorMessage400 } = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cardsData) => res.send(cardsData))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotFound'))
    .then((cardsData) => res.send(cardsData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(errorMessage400);
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
    .orFail(new Error('NotFound'))
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};

module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((cardData) => res.send(cardData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(errorMessage400);
      }
      return next(err);
    });
};
