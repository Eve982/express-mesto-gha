const router = require('express').Router();
const { validateCreateCard, validateID } = require('../middlewares/validatiors');
const {
  getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateID, deleteCard);
router.put('/:cardId/likes', validateID, setCardLike);
router.delete('/:cardId/likes', validateID, deleteCardLike);

module.exports = router;
