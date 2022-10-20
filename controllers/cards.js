const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { userId } = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndDelete({ _id })
    .then((cardsData) => res.send({ cardsData }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => res.send({ cardData }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => res.send({ cardData }))
    .catch((err) => res.status(404).send({ message: err.message }));
};
