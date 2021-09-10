
module.exports = {
  notes: (parent, args, { models }) => models.Note.find(), // async await
  note: (parent, args, { models }) => models.Note.findById(args.id) // args - Аргументы, передаваемые пользователем в запросе
};
