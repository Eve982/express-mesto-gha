const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setCardLike);
router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
