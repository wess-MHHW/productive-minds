const Task = require("./../../models/task");
const getWeekInterval = require("./get-week");
const filterFileds = require("./filter-fields");

module.exports = async (user) => {
  const [categoriesCount, tagsCount] = await Promise.all([
    Promise.all(
      user.categories.map((category) =>
        Task.countDocuments({ publisher: user._id, category: category.title })
      )
    ),
    Promise.all(
      user.tags.map((tag) =>
        Task.countDocuments({ publisher: user._id, tags: { $in: tag.title } })
      )
    ),
  ]);

  user.categories = user.categories.map((category, index) => ({
    ...category,
    count: categoriesCount[index],
  }));

  user.tags = user.tags.map((tag, index) => ({
    ...tag,
    count: tagsCount[index],
  }));

  let start = new Date();
  let end = new Date();
  end.setDate(end.getDate() + 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  let today = await Task.countDocuments({
    date: { $gte: start, $lt: end },
  });

  let dates = getWeekInterval();

  let upcoming = await Task.countDocuments({
    date: { $gte: dates[0], $lt: dates[1] },
  });

  return {
    today: today,
    upcoming: upcoming,
    user: filterFileds(user._doc, [
      "_id",
      "name",
      "email",
      "occupation",
      "categories",
      "tags",
    ]),
  };
};
