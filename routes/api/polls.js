const express = require("express");
const passport = require("passport");

const router = express.Router();

//  Load Poll model
const Poll = require("../../models/Poll");

//  Validation
const validatePollInput = require("../../validation/poll");

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
    const { errors, isValid } = validatePollInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPoll = new Poll({
      user: req.user.id,
      user_name: req.user.name,
      question: req.body.question,
      options: [
        {
          text: req.body.option1,
          votes: 0
        },

        {
          text: req.body.option2,
          votes: 0
        },

        {
          text: req.body.option3,
          votes: 0
        },

        {
          text: req.body.option4,
          votes: 0
        }
      ],
      voters: []
    });
    newPoll
      .save()
      .then(poll => res.json(poll))
      .catch(err => console.log(err));
  }
);

// @route   GET api/polls/:id
// @desc    Get a poll by its id
// @access  Public
router.get("/:id", (req, res) => {
  Poll.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

// @route   GET api/polls/
// @desc    Get all polls
// @access  Public
router.get("/", (req, res) => {
  Poll.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

// @route   POST api/polls/vote
// @desc    Vote on a poll
// @access  Private
router.post(
  "/vote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  Find poll by ID
    Poll.findById(req.body.poll).then(poll => {
      poll.voters.forEach(voter => {
        if (voter.user.toString() === req.user.id) {
          return res.status(400).json({ error: "You have already voted!" });
        }
      });
      //  Find option by ID
      poll.options.forEach(option => {
        if (option.id === req.body.option) {
          option.votes++;
          poll.voters.unshift({ user: req.user.id });
        }
      });
      poll.save(err => {
        if (err) {
          res.status(400).json({ error: "Unsuccessful voting request." });
        }
        var io = req.app.get("socketio");
        io.emit("newvote", req.body.poll);
        return res.json();
      });
    });
  }
);

// @route   DELETE api/polls/:id
// @desc    Delete a poll by ID
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Poll.findById(req.params.id)
      .then(poll => {
        if (poll.user.toString() !== req.user.id) {
          return res.status(401).json({ error: "You are not authorized." });
        }

        poll
          .remove()
          .then(() => res.json({ success: "Poll successfully deleted." }));
      })
      .catch(err => res.status(404).json({ error: "Post not found." }));
  }
);
module.exports = router;
