const jwt = require('jsonwebtoken');
const { UNAUTORIZED, JWT_SECRET } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(UNAUTORIZED)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const jwtToken = () => {
    if (req.cookies.jwt) {
      return req.cookies.jwt;
    }
    return req.headers.authorization.replace('Bearer ', '');
  };

  // const jwtToken = req.cookies.jwt;
  // const { authorization } = req.headers.authorization;

  if (!jwtToken()) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken(), JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
};
