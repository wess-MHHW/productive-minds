const promiseHandler = require("../utils/functions/promise-handler");
const Sticky = require("../models/sticky");
const CustomError = require("../utils/classes/custom-error");
const filterFields = require("./../utils/functions/filter-fields");

exports.create = promiseHandler(async (req, res, next) => {
  let { content } = req.body;
  let sticky = new Sticky({ publisher: req.user._id, content: content });
  sticky = await sticky.save();
  res.status(201).json({
    status: "success",
    data: {
      sticky: filterFields(sticky._doc, [
        "publisher",
        "content",
        "createdAt",
        "_id",
      ]),
    },
  });
});

exports.getAll = promiseHandler(async (req, res, next) => {
  let stickies = await Sticky.find({ publisher: req.user._id }).sort(
    "-createdAt"
  );
  res.status(200).json({
    status: "success",
    data: {
      stickies: stickies.map((sticky) =>
        filterFields(sticky._doc, ["publisher", "content", "createdAt", "_id"])
      ),
    },
  });
});

exports.updateSticky = promiseHandler(async (req, res, next) => {
  const id = req.params["id"];
  let { content } = req.body;
  let sticky = await Sticky.findById(id);
  if (!sticky) {
    next(new CustomError(400, "Sticky wall not found."));
  }

  sticky.content = content;

  sticky = await sticky.save();

  res.status(200).json({
    status: "success",
    data: {
      sticky: filterFields(sticky._doc, [
        "publisher",
        "content",
        "createdAt",
        "_id",
      ]),
    },
  });
});

exports.deleteSticky = promiseHandler(async (req, res, next) => {
  const id = req.params["id"];

  await Sticky.deleteOne({ _id: id });
  res.status(200).json({
    status: "success",
    data: {
      sticky: null,
    },
  });
});

exports.deleteAll = promiseHandler(async (req, res, next) => {
  await Sticky.deleteMany({ publisher: req.user._id });
  res.status(200).json({
    status: "success",
    data: {
      stickies: null,
    },
  });
});
