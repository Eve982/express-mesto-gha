const { Joi, celebrate } = require('celebrate');

const { object, string } = Joi.types();
const { REGEX_LINK } = require('../utils/constants');

module.exports.validateCreateUser = celebrate({
  body: object.keys({
    name: string.min(2).max(30),
    about: string.min(2).max(30),
    avatar: string.min(2).pattern(REGEX_LINK),
    email: string.required().email(),
    password: string.required(),
  }),
});

module.exports.validateLogin = celebrate({
  body: object.keys({
    email: string.required().email(),
    password: string.required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    about: string.required().min(2).max(30),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: object.keys({
    name: string.required().min(2).max(30),
    link: string.required().min(2).regex(REGEX_LINK),
  }),
});

module.exports.valdateURL = celebrate({
  body: object.keys({
    avatar: string.required().regex(REGEX_LINK),
  }),
});

module.exports.validateID = celebrate({
  params: object.keys({
    userId: string.required().id().alphanum().length(24),
  }),
});
