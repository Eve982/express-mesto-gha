const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { object, string } = Joi.types();
const {
  getAllUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', celebrate({
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), getAllUsers);

router.get('/:userId', celebrate({
  params: object.keys({
    userId: string.required().id(),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), getUserById);

router.get('/me', celebrate({
  params: object.keys({
    userId: string.required().id(),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), getUserById);

router.patch('/me', celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    about: string.required().min(2),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: object.keys({
    avatar: string.required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
