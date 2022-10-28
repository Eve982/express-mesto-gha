const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { object, string } = Joi.types();
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    link: string.required().min(2).regex(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate({
  params: object.keys({
    cardId: string.required().id(),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: object.keys({
    cardId: string.required().id(),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), setCardLike);

router.delete('/:cardId/likes', celebrate({
  params: object.keys({
    cardId: string.required().id(),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), deleteCardLike);

module.exports = router;
