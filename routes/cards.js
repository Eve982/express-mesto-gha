const router = require('express').Router();
const { validateCreateCard, validateCardId } = require('../middlewares/validatiors');
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, setCardLike);
router.delete('/:cardId/likes', validateCardId, deleteCardLike);

module.exports = router;
