const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, createUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.post('/', createUser);

module.exports = router;
