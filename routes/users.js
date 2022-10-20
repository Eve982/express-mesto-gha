const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, createUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.post('/users', createUser);

module.exports = router;
