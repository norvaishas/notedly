const models = require('../models');

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
  }
};
