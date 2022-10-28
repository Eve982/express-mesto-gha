const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const UnauthorizedError = require('../errors/unautorized_error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа, введено {VALUE}.'],
    maxlength: [30, 'Максимальная длина поля 30 символа, введено {VALUE}.'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа, введено {VALUE}.'],
    maxlength: [30, 'Максимальная длина поля 30 символа, введено {VALUE}.'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => isURL(v), message: 'Некорректный URL-адрес.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v), message: 'Неправильный формат почты.',
    },
  },
  password: {
    type: String,
    minlength: [2, 'Минимальная длина пароля 2 символа, введено {VALUE}.'],
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
          } return user;
        });
    });
};

// cardSchema.statics.isProfileOwner = function (cardId, userId) {
//   return this.findById(cardId).orFail(new NotFoundError('Такая карточка не существует.'))
//     .then((card) => {
//       const cardOwnerId = JSON.parse(JSON.stringify(card.owner._id));
//       const userID = JSON.parse(JSON.stringify(userId));
//       if (cardOwnerId !== userID) {
//         return Promise.reject(new ForbiddenError('Нельзя удалять чужие карточки.'));
//       } return cardId;
//     });
// };

module.exports = mongoose.model('user', userSchema);
