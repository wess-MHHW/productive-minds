const promiseHandler = require("./../utils/functions/promise-handler");
const filterFileds = require("./../utils/functions/filter-fields");
const generateToken = require("./../utils/functions/generate-token");
const CustomError = require("./../utils/classes/custom-error");
const User = require("./../models/user");
const Task = require("./../models/task");
const getUser = require("./../utils/functions/get-user");

exports.getUser = promiseHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  let data = await getUser(user);

  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: data,
  });
});

exports.updateUser = promiseHandler(async (req, res, next) => {
  let data = filterFileds(req.body, [
    "name",
    "email",
    "occupation",
    "currentPassword",
    "password",
  ]);

  if (!data.hasOwnProperty("currentPassword")) {
    next(new CustomError(400, "Password is required."));
    return;
  }

  if (data.hasOwnProperty("email")) {
    if (await User.findOne({ email: data["email"] })) {
      next(new CustomError(400, "Email is already taken."));
      return;
    }
  }

  let user = await User.findById(req.user.id).select("+password");

  let isMatch = await user.comparePassword(data["currentPassword"]);

  if (!isMatch) {
    next(new CustomError(400, "Wrong password."));
    return;
  }

  const token = generateToken(user._id);

  if (Object.keys(data).length === 1) {
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: filterFileds(user._doc, [
          "_id",
          "name",
          "email",
          "occupation",
          "categories",
          "tags",
        ]),
      },
    });
    return;
  }

  for (const [key, value] of Object.entries(data)) {
    if (key !== "currentPassword") {
      user[key] = value;
    }
  }

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    token,
    data: result,
  });
  return;
});

exports.deleteUser = promiseHandler(async (req, res, next) => {
  const { password } = req.body;
  let user = await User.findById(req.user.id).select("+password");

  let isMatch = await user.comparePassword(password);

  if (!isMatch) {
    next(new CustomError(400, "Wrong password."));
    return;
  }

  await User.findOneAndDelete({ _id: req.user.id });
  await Task.deleteMany({ publisher: req.user.id });
  res.status(200).json({
    status: "success",
    data: {
      user: null,
    },
  });
});

exports.addCategory = promiseHandler(async (req, res, next) => {
  const { title, color } = req.body;

  if (!title && !color) {
    next(new CustomError(400, "Title and color are required."));
    return;
  }

  let user = await User.findById(req.user._id);

  if (
    user.categories.find(
      (category) => category.title.toLowerCase() === title.toLowerCase()
    )
  ) {
    next(new CustomError(400, "Title already exists."));
    return;
  }

  user.categories.push({ title, color, count: 0 });

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.deleteCategory = promiseHandler(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    next(new CustomError(400, "Title is required."));
  }

  let user = await User.findById(req.user._id);
  user.categories = user.categories.filter(
    (category) => category.title !== title
  );

  await Task.deleteMany({
    publisher: user._id,
    category: title,
  });

  if (user.categories.length === 0) {
    user.categories = [{ title: "Personal", color: "#ff6b6b", count: 0 }];
  }

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.updateCategories = promiseHandler(async (req, res, next) => {
  const { categories } = req.body;

  if (!categories) {
    next(new CustomError(400, "Categories is required."));
    return;
  }

  if (categories.length > 1) {
    let set = new Set(
      categories.map((category) => category.title.toLowerCase())
    );
    if (categories.length !== set.size) {
      next(new CustomError(400, "Duplicate title."));
      return;
    }
  }

  let user = await User.findById(req.user._id);

  categories.forEach(async (element, index) => {
    await Task.updateMany(
      { publisher: req.user._id, category: user.categories[index].title },
      { category: element.title }
    );
  });

  user.categories = categories;

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.deleteCategories = promiseHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,

    {
      categories: [{ title: "Personal", color: "#ff6b6b", count: 0 }],
    },
    { new: true }
  );

  await Task.deleteMany({
    publisher: user._id,
  });

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.addTag = promiseHandler(async (req, res, next) => {
  const { title, color } = req.body;

  if (!title && !color) {
    next(new CustomError(400, "Title and color are required."));
    return;
  }

  let user = await User.findById(req.user._id);

  if (
    user.tags.find((tag) => tag.title.toLowerCase() === title.toLowerCase())
  ) {
    next(new CustomError(400, "Title already exists."));
    return;
  }

  user.tags.push({ title, color, count: 0 });

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.deleteTag = promiseHandler(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    next(new CustomError(400, "Title is required."));
  }

  let user = await User.findById(req.user._id);
  user.tags = user.tags.filter((tag) => tag.title !== title);

  user = await user.save();
  await Task.updateMany({ tags: { $in: [title] } }, { $pull: { tags: title } });

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.updateTags = promiseHandler(async (req, res, next) => {
  const { tags } = req.body;

  if (!tags) {
    next(new CustomError(400, "Tags is required."));
    return;
  }

  if (tags.length > 1) {
    let set = new Set(tags.map((category) => category.title.toLowerCase()));
    if (tags.length !== set.size) {
      next(new CustomError(400, "Duplicate title."));
      return;
    }
  }

  let user = await User.findById(req.user._id);

  tags.forEach(async (element, index) => {
    await Task.updateMany(
      { publisher: req.user._id, tags: { $in: [user.tags[index].title] } },
      { $set: { "tags.$": element.title } }
    );
  });

  user.tags = tags;

  user = await user.save();

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.deleteTags = promiseHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,

    { tags: [] },
    { new: true }
  );

  await Task.updateMany(
    {
      publisher: user._id,
    },
    { tags: [] }
  );

  let result = await getUser(user);

  res.status(200).json({
    status: "success",
    data: result,
  });
});
