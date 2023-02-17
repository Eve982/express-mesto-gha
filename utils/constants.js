const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTORIZED = 401;
const SERVER_ERROR = 500;
const REGEX_LINK = /^https?:\/\/(www.)?\S+\.\S+#?/i;
const ALLOWED_CORS = [
  'https://eve982.pet-project.nomoredomains.work',
  'http://eve982.pet-project.nomoredomains.work',
  'http://localhost:3000',
];

module.exports = {
  BAD_REQUEST, UNAUTORIZED, SERVER_ERROR, CREATED, REGEX_LINK, ALLOWED_CORS,
};
