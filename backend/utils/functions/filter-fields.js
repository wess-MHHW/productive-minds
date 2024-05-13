module.exports = (object, fields) => {
  let result = {};
  Object.keys(object).forEach((property) => {
    if (fields.includes(property)) {
      result[property] = object[property];
    }
  });
  return result;
};
