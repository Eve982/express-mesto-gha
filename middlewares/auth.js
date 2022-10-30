const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthorizedError = require('../errors/unautorized_error');

const UnauthorizedMessage = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const jwtToken = () => {
    if (req.cookies.jwt) {
      return req.cookies.jwt;
    } return next(new UnauthorizedError(UnauthorizedMessage));
  };
  let payload;
  try {
    payload = jwt.verify(jwtToken(), JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(UnauthorizedMessage));
  }
  req.user = payload;
  return next();
};
