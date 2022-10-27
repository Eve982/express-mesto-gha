const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
  }),
}), getUserById);
router.get('/me', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), updateAvatar);

module.exports = router;
