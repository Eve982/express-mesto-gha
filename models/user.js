const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа, введено {VALUE}'],
    maxlength: [30, 'Максимальная длина поля 30 символа, введено {VALUE}'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа, введено {VALUE}'],
    maxlength: [30, 'Максимальная длина поля 30 символа, введено {VALUE}'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
