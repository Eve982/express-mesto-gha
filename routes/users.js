const router = require('express').Router();
const { validateUpdateUser, valdateURL, validateID } = require('../middlewares/validatiors');
const {
  getAllUsers, getUserById, updateUser, updateAvatar, getMyPage,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getMyPage);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', valdateURL, updateAvatar);
router.get('/:userId', validateID, getUserById);

module.exports = router;
