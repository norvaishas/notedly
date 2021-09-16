// Запрашиваем библиотеку mongoose
const mongoose = require('mongoose');

// Определяем схему заметки БД
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      // type: mongoose.Schema.ObjectId, // так тоже работает (без Types)
      ref: 'User',
      required: true
    }
  },
  {
    // Присваиваем поля createdAt и updatedAt с типом данных
    timestamps: true
  }
);

// Определяем модель 'Note' со схемой
const Note = mongoose.model("Note", noteSchema);

// Экспортируем модуль
module.exports = Note;
