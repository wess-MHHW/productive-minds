const jwt = require("jsonwebtoken");

module.exports = (token) => {
  return jwt.verify(token, process.env.SECRET_STRING);
};
