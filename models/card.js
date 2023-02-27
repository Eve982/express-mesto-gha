const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const NotFoundError = require('../errors/not_found_error');
const ForbiddenError = require('../errors/forbidden_error');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля 2 символа, введено {VALUE}'],
      maxlength: [30, 'Максимальная длина поля 30 символа, введено {VALUE}'],
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => isURL(v), message: 'Некорректный URL-адрес.',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

cardSchema.statics.isCardOwner = function (cardId, userId) {
  return this.findById(cardId).orFail(new NotFoundError('Такая карточка не существует.'))
    .then((card) => {
      const cardOwnerId = JSON.stringify(card.owner._id);
      const userID = JSON.stringify(userId);
      if (cardOwnerId !== userID) {
        return Promise.reject(new ForbiddenError('Нельзя удалять чужие карточки.'));
      }
      return card;
    });
};

module.exports = mongoose.model('card', cardSchema);
