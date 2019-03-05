const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "An email is required.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "A password is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
