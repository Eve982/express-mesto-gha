const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { object, string } = Joi.types();
const {
  getAllUsers, getUserById, updateUser, updateAvatar, getMyPage,
} = require('../controllers/users');

router.get('/', celebrate({
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, getAllUsers);

router.get('/:userId', celebrate({
  params: object.keys({
    userId: string.required().id().alphanum().length(24),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, getUserById);

router.get('/me', celebrate({
  headers: object.keys({
    Autorization: string.token(),
    cookie: string.token(),
  }).unknown(true),
}), auth, getMyPage);

router.patch('/me', celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    about: string.required().min(2).max(30),
  }),
  headers: object.keys({
    Autorization: string.token(),
    cookie: string.token(),
  }).unknown(true),
}), auth, updateUser);

router.patch('/me/avatar', celebrate({
  body: object.keys({
    avatar: string.required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
  headers: object.keys({
    Autorization: string.token(),
  }).unknown(true),
}), auth, updateAvatar);

module.exports = router;
