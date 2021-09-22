
module.exports = {
  notes: (parent, args, { models }) => models.Note.find(), // async await
  note: (parent, args, { models }) => models.Note.findById(args.id), // args - Аргументы, передаваемые пользователем в запросе
  user: (parent, { username }, { models }) => models.User.findOne({username}),
  users: (parent, args, { models }) => models.User.find({}),
  me: (parent, args, { models, user }) => models.User.findById(user.id)
};
