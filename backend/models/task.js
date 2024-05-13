const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  publisher: {
    type: String,
    required: [true, "Publisher is required."],
  },
  title: {
    type: String,
    required: [true, "Title is required."],
  },
  description: {
    type: String,
    default: "",
  },
  done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: [true, "Date is required."],
  },
  category: {
    type: Object,
    required: [true, "Category is required."],
    default: {},
  },
  tags: {
    type: [Object],
    default: [],
  },
});

const task = mongoose.model("task", schema);

module.exports = task;
