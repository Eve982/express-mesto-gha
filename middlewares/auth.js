const jwt = require('jsonwebtoken');
const { UNAUTORIZED, JWT_SECRET } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(UNAUTORIZED)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  console.log(jwtToken);
  if (!jwtToken) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
};
