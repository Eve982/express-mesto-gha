const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isEmail');
const auth = require('../middlewares/auth');

const { object, string } = Joi.types();
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', auth, getCards);

router.post('/', celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    link: string.required().min(2).pattern({
      validator: (v) => isURL(v), message: 'Некорректный URL-адрес.',
    }),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, createCard);

router.delete('/:cardId', celebrate({
  params: object.keys({
    cardId: string.required().id().alphanum().length(24),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate({
  params: object.keys({
    cardId: string.required().id().alphanum().length(24),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, setCardLike);

router.delete('/:cardId/likes', celebrate({
  params: object.keys({
    cardId: string.required().id().alphanum().length(24),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, deleteCardLike);

module.exports = router;
