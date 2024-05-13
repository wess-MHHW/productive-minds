const promiseHandler = require("./../utils/functions/promise-handler");
const filterFields = require("./../utils/functions/filter-fields");
const CustomError = require("./../utils/classes/custom-error");
const Task = require("./../models/task");
const { default: mongoose } = require("mongoose");

exports.createTask = promiseHandler(async (req, res, next) => {
  let task = new Task(req.body);
  task.publisher = req.user._id;
  task = await task.save();

  res.status(201).json({
    status: "success",
    data: {
      task: filterFields(task._doc, [
        "title",
        "description",
        "done",
        "date",
        "category",
        "tags",
        "_id",
      ]),
    },
  });
});

exports.updateTask = promiseHandler(async (req, res, next) => {
  const id = req.params["id"];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new CustomError(400, id + " is not a valid id."));
    return;
  }
  let task = await Task.findOne({
    _id: id,
  });
  if (!task) {
    next(new CustomError(400, "Task does not exist."));
    return;
  }

  let data = filterFields(req.body, [
    "title",
    "description",
    "date",
    "category",
    "tags",
    "done",
  ]);

  if (Object.keys(data).length === 0) {
    res.status(200).json({
      status: "success",
      data: {
        task: filterFields(task._doc, [
          "title",
          "description",
          "done",
          "date",
          "category",
          "tags",
          "_id",
        ]),
      },
    });
    return;
  }

  for (const [key, value] of Object.entries(data)) {
    task[key] = value;
  }

  task = await task.save();

  res.status(200).json({
    status: "success",
    data: {
      task: filterFields(task._doc, [
        "title",
        "description",
        "done",
        "date",
        "category",
        "tags",
        "_id",
      ]),
    },
  });
  return;
});

exports.deleteTask = promiseHandler(async (req, res, next) => {
  const id = req.params["id"];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new CustomError(400, id + " is not a valid id."));
    return;
  }
  const task = await Task.findOne({
    _id: id,
  });
  if (!task) {
    next(new CustomError(400, "Task does not exist."));
    return;
  }

  await Task.deleteOne({ _id: id });
  res.status(200).json({
    status: "success",
    data: {
      task: null,
    },
  });
});

exports.filterTasks = promiseHandler(async (req, res, next) => {
  let str = JSON.stringify(req.query);
  str = str.replace(/\b(in|gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let data = JSON.parse(str);

  let query = Task.find();
  if (data.hasOwnProperty("title")) {
    query = query.where("title").regex(new RegExp("^" + data.title, "i"));
  }

  if (data.hasOwnProperty("category")) {
    query = query.where("category").regex(new RegExp(data.category, "i"));
  }

  if (data.hasOwnProperty("tag")) {
    query = query.where("tags").regex(new RegExp(data.tag, "i"));
  }

  if (data.hasOwnProperty("date")) {
    if (data.date.hasOwnProperty("$in")) {
      let dates = data.date["$in"].slice(1, -1).split(",");

      dates = dates.map((str) => new Date(str));
      query = query.where("date").gte(dates[0]).lt(dates[1]);
    }
  }

  if (data.hasOwnProperty("sort")) {
    query = query.sort(req.query.sort);
  }

  const tasks = await query.exec();

  res.status(200).json({
    status: "success",
    length: tasks.length,
    data: {
      tasks,
    },
  });
});
