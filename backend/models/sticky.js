const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    publisher: {
      type: String,
      required: [true, "Publisher is required."],
    },
    content: {
      type: String,
      required: [true, "content is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sticky", schema);
