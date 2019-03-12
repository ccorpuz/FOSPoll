const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Create Schema
const PollSchema = new Schema({
  creator: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  option1: [
    {
      name: String,
      votes: Number
    }
  ],
  option2: [
    {
      name: String,
      votes: Number
    }
  ],
  option3: [
    {
      name: String,
      votes: Number
    }
  ],
  option4: [
    {
      name: String,
      votes: Number
    }
  ]
});

module.exports = Poll = mongoose.model("polls", PollSchema);
