const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

//  Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//  Load Keys
const keys = require("../../config/keys");
//  Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users route works!" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  // Validate input
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashed) => {
          if (err) throw err;
          newUser.password = hashed;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Log a user in
// @access  Public
router.post("/login", (req, res) => {
  // Validate input
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //  Find user by email
  User.findOne({ email }).then(user => {
    //  Check for user
    if (!user) {
      errors.email = "User not found.";
      return res.status(404).json(errors);
    }

    //  Check password
    bcrypt.compare(password, user.password).then(passed => {
      if (passed) {
        const payload = { id: user.id, name: user.name, email: user.email };
        //    Sign token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user details
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
