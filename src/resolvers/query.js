const models = require('../models');

module.exports = {
  notes: () => models.Note.find(), // async await
  note: (parent, args) => models.Note.findById(args.id) // args - Аргументы, передаваемые пользователем в запросе
};
