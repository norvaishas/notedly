
module.exports = {
  notes: (parent, args, { models }) => models.Note.find(), // async await
  note: (parent, args, { models }) => models.Note.findById(args.id), // args - Аргументы, передаваемые пользователем в запросе
  user: (parent, { username }, { models }) => models.User.findOne({username}),
  users: (parent, args, { models }) => models.User.find({}),
  me: (parent, args, { models, user }) => models.User.findById(user.id),
  noteFeed: async (parent, { cursor }, { models }) => {
    // Хардкодим лимит в 10 элементов
    const limit = 10;
    // Устанавливаем значение false по умолчанию для hasNextPage
    let hasNextPage = false;
    // Если курсор передан не будет, то по умолчанию запрос будет пуст
    // В таком случае из БД будут извлечены последние заметки
    let cursorQuery = {};
    // Если курсор задан, запрос будет искать заметки со значением ObjectId меньше этого курсора
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    // Находим в БД limit + 1 заметок, сортируя их от старых к новым
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);
    // Если число найденных заметок превышает limit, устанавливаем
    // hasNextPage как true и обрезаем заметки до лимита
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }
    // Новым курсором будет ID Mongo-объекта последнего элемента массива списка
    const newCursor = notes[notes.length - 1]._id;
    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};
