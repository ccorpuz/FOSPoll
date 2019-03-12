const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

//  Load Poll model
const Poll = require("../../models/Poll");

// @route   GET api/polls/test
// @desc    Tests polls route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Polls route works!" }));

// @route   POST api/polls/newpoll
// @desc    Create a new poll
// @access  Private
router.post(
  "/newpoll",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPoll = new Poll({
      creator: req.user.email,
      question: req.body.question,
      option1: [{ name: req.body.option1, votes: 0 }],
      option2: [{ name: req.body.option2, votes: 0 }],
      option3: [{ name: req.body.option3, votes: 0 }],
      option4: [{ name: req.body.option4, votes: 0 }]
    });
    newPoll
      .save()
      .then(poll => res.json(poll))
      .catch(err => console.log(err));
  }
);

// @route   GET api/polls/current
// @desc    Get polls by the current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Poll.find({ creator: req.user.email }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.json(docs);
      }
    });
  }
);

module.exports = router;
