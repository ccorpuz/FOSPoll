const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Create Schema
const PollSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  user_name: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: String,
      votes: Number
    }
  ],
  voters: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = Poll = mongoose.model("polls", PollSchema);
