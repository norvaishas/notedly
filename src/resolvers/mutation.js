const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
  newNote: async (parent, args) => {
    return await models.Note.create({
      content: args.content,
      author: 'Serj Norvaishas'
    });
  },
  deleteNote: async (parent, args) => {
    try {
      await models.Note.findOneAndRemove({_id: args.id});
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, {content, id}) => {
    await models.Note.findOneAndUpdate(
      {_id: id},
      {
        $set: {content}
      }
    )
  },
  signUp: async (parent, { username, email, password }) => {
    email = email.trim().toLowerCase();
    // Хэшируем пароль
    const hashed = await bcrypt.hash(password, 10);
    // Создаем url gravatar-изображения
    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });
    // Создаем и возвращаем json web token
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
    // Если при регистрации возникла проблема, выбрасываем ошибку
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });
    // Если пользователь не найден, выбрасываем ошибку аутентификации
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }
    // Если пароли не совпадают, выбрасываем ошибку аутентификации
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }
    // Создаем и возвращаем json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  }
};
