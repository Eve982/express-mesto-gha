const router = require('express').Router();
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/users');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards:cardId', deleteCard);
router.put('/cards:cardId', setCardLike);
router.delete('/cards:cardId', deleteCardLike);

module.exports = router;
