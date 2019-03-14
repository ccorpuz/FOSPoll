const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePollInput(data) {
  let errors = {};

  data.question = !isEmpty(data.question) ? data.question : "";

  data.option1 = !isEmpty(data.option1) ? data.option1 : "";

  data.option2 = !isEmpty(data.option2) ? data.option2 : "";

  if (!Validator.isLength(data.question, { min: 1, max: 20 })) {
    errors.question = "The question should be between 1 and 20 characters";
  }

  if (Validator.isEmpty(data.question)) {
    errors.question = "A question is required.";
  }

  if (Validator.isEmpty(data.option1)) {
    errors.option1 = "At least 2 options are required.";
  }

  if (Validator.isEmpty(data.option2)) {
    errors.option2 = "At least 2 options are required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
