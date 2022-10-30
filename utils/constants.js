const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTORIZED = 401;
const SERVER_ERROR = 500;
const JWT_SECRET = 'd90e6195ea595edeb43468b33997b7aeb3fd41c0e65ade2dbf8ccf2d299a5b77';
const REGEX_LINK = /^https?:\/\/(www.)?\S+\.\S+#?/i;

module.exports = {
  BAD_REQUEST, UNAUTORIZED, SERVER_ERROR, CREATED, JWT_SECRET, REGEX_LINK,
};
