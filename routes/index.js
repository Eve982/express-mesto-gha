const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not_found_error');
const { createUser, login, logout } = require('../controllers/users');
const { validateLogin, validateCreateCard } = require('../middlewares/validatiors');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateCard, createUser);
router.post('/signin', login);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс ${req.baseUrl} не найден.`));
});
module.exports = router;
