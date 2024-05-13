const jwt = require("jsonwebtoken");

module.exports = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
