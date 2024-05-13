const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        let pattern = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
        return pattern.test(value);
      },
      message: function (propos) {
        return `"${propos.value}" is not a valid email!`;
      },
    },
  },
  occupation: {
    type: String,
    required: [true, "Occupation is required."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: 8,
    select: false,
  },
  passwordChanged: {
    type: Date,
    default: null,
    select: false,
  },
  categories: {
    type: [Object],
    default: [
      { title: "Personal", color: "#ff6b6b", count: 0 },
      { title: "Work", color: "#66d9e8", count: 0 },
    ],
  },
  tags: {
    type: [Object],
    default: null,
  },
  token: {
    type: Map,
    default: null,
    select: false,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.comparePassword = async function (provided) {
  return await bcrypt.compare(provided, this.password);
};

schema.methods.createToken = function () {
  let token = crypto.randomBytes(8).toString("hex");
  this.token = {
    token: crypto.createHash("sha256").update(token).digest("hex"),
    expiry: Date.now() + 5 * 60 * 1000,
  };
  return token;
};

schema.methods.isPasswordUpdated = async function (JWTTimestamp) {
  if (this.passwordChanged) {
    if (JWTTimestamp < this.passwordChanged.getTime() / 1000) {
      return true;
    }
  }
  return false;
};

const User = mongoose.model("user", schema);

module.exports = User;
