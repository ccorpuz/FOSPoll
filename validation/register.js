const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.cpassword = !isEmpty(data.cpassword) ? data.cpassword : "";

  if (!Validator.isLength(data.name, { min: 3, max: 15 })) {
    errors.name = "Name must be between 3 and 15 characters.";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "A name is required.";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "An email is required.";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "A password is required.";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = "A password between 6 and 20 characters is required.";
  }

  if (Validator.isEmpty(data.cpassword)) {
    errors.cpassword = "Please confirm your password.";
  }

  if (!Validator.equals(data.password, data.cpassword)) {
    errors.password = "Passwords should match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
