const jwt = require('jsonwebtoken');

const { UNAUTORIZED, JWT_SECRET } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(UNAUTORIZED)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('jwt=', '');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(cookie);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
};
